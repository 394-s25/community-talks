// utils/addSlugsToCommunity.js
import { db } from "../firebase";
import { ref, get, update } from "firebase/database";

// slugify 工具函数
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/gi, "");

export const addSlugsToCommunity = async () => {
  try {
    const snapshot = await get(ref(db, "Community"));
    const data = snapshot.val();

    if (!data) {
      console.warn("No data found at /Community");
      return;
    }

    for (const [category, entities] of Object.entries(data)) {
      for (const [id, entry] of Object.entries(entities)) {
        if (!entry.slug && entry.name) {
          const newSlug = slugify(entry.name);
          const path = `Community/${category}/${id}`;
          await update(ref(db, path), { slug: newSlug });
          console.log(`✅ Added slug to ${id}: ${newSlug}`);
        }
      }
    }

    console.log("🎉 Finished adding slugs!");
  } catch (err) {
    console.error("❌ Error adding slugs:", err);
  }
};
