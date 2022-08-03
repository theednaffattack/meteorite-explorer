import { flushMeteorRecords } from "./flush-meteor-records";

flushMeteorRecords().catch((err) => console.error("ERROR FLUSHING DB"));
