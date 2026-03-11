export type Event = {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
};

export const events: Event[] = [
    {
        title: "Google I/O 2026",
        image: "/images/event1.png",
        slug: "google-io-2026",
        location: "Shoreline Amphitheatre, Mountain View, CA + online",
        date: "May 13–14, 2026",
        time: "Keynotes 10:00 AM PT",
    },
    {
        title: "Apple WWDC 2026",
        image: "/images/event2.png",
        slug: "wwdc-2026",
        location: "Apple Park, Cupertino, CA + online",
        date: "June 8–12, 2026",
        time: "Keynote 10:00 AM PT (Jun 8)",
    },
    {
        title: "Microsoft Build 2026",
        image: "/images/event3.png",
        slug: "microsoft-build-2026",
        location: "Seattle, WA + online",
        date: "May 19–21, 2026",
        time: "9:00 AM PT",
    },
    {
        title: "AWS re:Invent 2026",
        image: "/images/event4.png",
        slug: "aws-reinvent-2026",
        location: "Las Vegas, NV",
        date: "Nov 30 – Dec 4, 2026",
        time: "All-day sessions",
    },
    {
        title: "KubeCon + CloudNativeCon North America 2026",
        image: "/images/event5.png",
        slug: "kubecon-na-2026",
        location: "Chicago, IL",
        date: "Oct 13–16, 2026",
        time: "8:30 AM CT",
    },
    {
        title: "HackMIT 2026",
        image: "/images/event6.png",
        slug: "hackmit-2026",
        location: "MIT, Cambridge, MA",
        date: "Sep 19–20, 2026",
        time: "48-hour hackathon",
    },
];
