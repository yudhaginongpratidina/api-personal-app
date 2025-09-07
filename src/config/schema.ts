import { pgTable, timestamp, varchar, text, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("users", {
    id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => createId()),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
    id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    refreshTokenHash: varchar("refresh_token_hash", { length: 255 }).notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 500 }),
    deviceType: varchar("device_type", { length: 50 }),
    expiredAt: timestamp("expired_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("projects", {
    id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    category: pgEnum("project_category", [
        "website",
        "mobile",
        "desktop",
        "backend",
        "internet_of_things",
        "saas",
        "game",
    ])("category").notNull(),
    techStack: text("tech_stack").notNull(),
    description: text("description").notNull(),
    challenge: text("challenge").notNull(),
    status: pgEnum("project_status", [
        "development",
        "demo",
        "production",
        "maintenance",
        "archive",
    ])("status").notNull(),
    impact: text("impact").notNull(),
    repositoryUrl: varchar("repository_url", { length: 255 }).notNull(),
    demoUrl: varchar("demo_url", { length: 255 }),
    thumbnail: varchar("thumbnail", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const experiences = pgTable("experiences", {
    id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }).notNull(),
    position: varchar("position", { length: 255 }).notNull(),
    startDate: varchar("start_date", { length: 50 }).notNull(),
    endDate: varchar("end_date", { length: 50 }),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})