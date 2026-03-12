import { HydratedDocument, Model, Schema, Types, model, models } from "mongoose";
import Event from "./event.model";

export interface Booking {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export type BookingDocument = HydratedDocument<Booking>;
export type BookingModel = Model<Booking>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<Booking>(
    {
        eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (value: string) => emailRegex.test(value),
                message: "Email is not valid",
            },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Ensure referenced event exists before saving.
BookingSchema.pre("save", async function (this: BookingDocument) {
    const exists = await Event.exists({ _id: this.eventId });
    if (!exists) {
        throw new Error("Referenced event does not exist");
    }
});

BookingSchema.index({ eventId: 1 });

const BookingModelInstance = (models.Booking as BookingModel | undefined) ?? model<Booking>("Booking", BookingSchema);

export default BookingModelInstance;
