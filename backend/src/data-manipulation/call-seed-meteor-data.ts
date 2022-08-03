import { seedMeteorData } from "./seed-meteor-data";

seedMeteorData().catch((err) => console.error("ERROR SEEDING DB", err));
