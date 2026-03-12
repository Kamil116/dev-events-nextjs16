import { HydratedDocument, Model, Schema, model, models } from "mongoose";

export interface Event {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string; // stored as YYYY-MM-DD
    time: string; // stored as HH:mm
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type EventDocument = HydratedDocument<Event>;
export type EventModel = Model<Event>;

const slugify = (text: string): string =>
    text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");

const EventSchema = new Schema<Event>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true },
        description: { type: String, required: true, trim: true },
        overview: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        venue: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        date: { type: String, required: true, trim: true },
        time: { type: String, required: true, trim: true },
        mode: { type: String, required: true, trim: true },
        audience: { type: String, required: true, trim: true },
        agenda: { type: [String], required: true, validate: (arr: string[]) => arr.length > 0 },
        organizer: { type: String, required: true, trim: true },
        tags: { type: [String], required: true, validate: (arr: string[]) => arr.length > 0 },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Keep slug unique and derived from title only when it changes.
// Runs on validate so required checks see the generated slug.
EventSchema.pre<EventDocument>("validate", async function () {
    // Basic non-empty validation for required string fields.
    type StringField =
        | "title"
        | "description"
        | "overview"
        | "image"
        | "venue"
        | "location"
        | "date"
        | "time"
        | "mode"
        | "audience"
        | "organizer";
    const requiredStrings: StringField[] = [
        "title",
        "description",
        "overview",
        "image",
        "venue",
        "location",
        "date",
        "time",
        "mode",
        "audience",
        "organizer",
    ];

    for (const field of requiredStrings) {
        const value = this[field];
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error(`${field} is required`);
        }
        this[field] = value.trim() as Event[typeof field];
    }

    // Normalize arrays to non-empty, trimmed entries.
    type ArrayField = "agenda" | "tags";
    const arrayFields: ArrayField[] = ["agenda", "tags"];
    for (const field of arrayFields) {
        const value = this[field];
        if (!Array.isArray(value) || value.length === 0) {
            throw new Error(`${field} must contain at least one item`);
        }
        const cleaned = value.map((item) => item.trim()).filter((item) => item.length > 0);
        this[field] = cleaned as Event[typeof field];
        if (cleaned.length === 0) {
            throw new Error(`${field} must contain at least one item`);
        }
    }

    // Generate slug when new or when title changes.
    if (this.isNew || this.isModified("title")) {
        const baseSlug = slugify(this.title);
        const EventModel = this.constructor as EventModel;
        let candidate = baseSlug;
        let suffix = 1;

        // Retry with incremented suffix until a unique slug is found.
        while (
            await EventModel.exists({
                slug: candidate,
                _id: { $ne: this._id },
            })
        ) {
            candidate = `${baseSlug}-${suffix++}`;
        }

        this.slug = candidate;
    }
    if (!this.slug) {
        throw new Error("Slug could not be generated");
    }

    // Normalize date to local YYYY-MM-DD without UTC shifting.
    const parsedDate = new Date(this.date);
    if (Number.isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
    }
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const ymd = `${year}-${month}-${day}`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
        throw new Error("Invalid date format");
    }
    this.date = ymd;

    // Normalize time to HH:mm (24h).
    const timeMatch = this.time.match(/^(\d{1,2}):(\d{2})$/);
    if (!timeMatch) {
        throw new Error("Time must be in HH:mm format");
    }
    const hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);
    if (hours > 23 || minutes > 59) {
        throw new Error("Time must be a valid 24h time");
    }
    this.time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
});

EventSchema.index({ slug: 1 }, { unique: true });

const EventModelInstance = (models.Event as EventModel | undefined) ?? model<Event>("Event", EventSchema);

export default EventModelInstance;
