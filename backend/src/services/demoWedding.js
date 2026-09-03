import Wedding from "../models/Wedding.js";
import Task from "../models/Task.js";
import Guest from "../models/Guest.js";
import Vendor from "../models/Vendor.js";
import BudgetItem from "../models/BudgetItem.js";
import TimelineItem from "../models/TimelineItem.js";
import Alert from "../models/Alert.js";

export async function ensureDemoWedding(user) {
  await user.populate("weddings");
  if (user.weddings.length) return user.weddings[0];

  const wedding = await Wedding.create({
    title: "Notre mariage",
    partner1: user.name?.split(" ")[0] || "Glorie",
    partner2: "Jordan",
    date: new Date("2027-06-12T14:00:00.000Z"),
    location: "Domaine de la Roseraie, Paris",
    budgetTarget: 20000,
    guestTarget: 150,
    status: "planning"
  });

  user.weddings.push(wedding._id);
  await user.save();

  await Promise.all([
    Task.insertMany([
      { wedding: wedding._id, title: "Confirmer le traiteur", dueDate: new Date("2026-09-18"), priority: "high", status: "todo" },
      { wedding: wedding._id, title: "Envoyer les invitations", dueDate: new Date("2026-09-25"), priority: "high", status: "in-progress" },
      { wedding: wedding._id, title: "Essai coiffure", dueDate: new Date("2026-10-02"), priority: "medium", status: "todo" },
      { wedding: wedding._id, title: "Réserver le photographe", dueDate: new Date("2026-10-12"), priority: "medium", status: "done" },
      { wedding: wedding._id, title: "Valider la décoration florale", dueDate: new Date("2026-10-20"), priority: "low", status: "todo" }
    ]),
    Guest.insertMany([
      { wedding: wedding._id, firstName: "Aïcha", lastName: "Diop", group: "Famille", rsvp: "confirmed", tableName: "Élégance" },
      { wedding: wedding._id, firstName: "Samuel", lastName: "Kouassi", group: "Amis", rsvp: "pending" },
      { wedding: wedding._id, firstName: "Marie", lastName: "Lemoine", group: "Amis", rsvp: "confirmed", tableName: "Harmonie" },
      { wedding: wedding._id, firstName: "Jean", lastName: "Dupont", group: "Collègues", rsvp: "declined" }
    ]),
    Vendor.insertMany([
      { wedding: wedding._id, name: "Traiteur Délice", category: "Traiteur", price: 3200, status: "booked" },
      { wedding: wedding._id, name: "Fleurs d'Eden", category: "Décoration", price: 1800, status: "booked" },
      { wedding: wedding._id, name: "Studio Lumière", category: "Photo & Vidéo", price: 1200, status: "paid" },
      { wedding: wedding._id, name: "DJ Harmony", category: "Animation", price: 900, status: "contacted" }
    ]),
    BudgetItem.insertMany([
      { wedding: wedding._id, label: "Location du domaine", category: "Lieu", estimated: 6000, actual: 4000, paid: true },
      { wedding: wedding._id, label: "Menu réception", category: "Traiteur", estimated: 5000, actual: 3200 },
      { wedding: wedding._id, label: "Tenues", category: "Tenues", estimated: 3000, actual: 2000 },
      { wedding: wedding._id, label: "Fleurs et décoration", category: "Décoration", estimated: 2500, actual: 1500 },
      { wedding: wedding._id, label: "Photo & vidéo", category: "Photo & Vidéo", estimated: 1500, actual: 750 }
    ]),
    TimelineItem.insertMany([
      { wedding: wedding._id, title: "Préparatifs", startTime: new Date("2027-06-12T08:00:00.000Z"), responsible: "Wedding planner" },
      { wedding: wedding._id, title: "Cérémonie", startTime: new Date("2027-06-12T14:00:00.000Z"), location: "Domaine de la Roseraie" },
      { wedding: wedding._id, title: "Cocktail", startTime: new Date("2027-06-12T16:00:00.000Z"), location: "Jardin" },
      { wedding: wedding._id, title: "Dîner & soirée", startTime: new Date("2027-06-12T19:00:00.000Z"), location: "Grande salle" }
    ]),
    Alert.create({ wedding: wedding._id, type: "warning", title: "Traiteur à confirmer", message: "Pensez à confirmer le nombre final de menus avant le 18 septembre." })
  ]);

  return wedding;
}
