import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_ID,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default async function handler(req, res) {
  try {  
    const { album } = req.query;

    // fallback if no album passed
    const expression = album
      ? `folder:gallery/${album}/*`
      : "folder:gallery/*";

    const result = await cloudinary.search
      .expression(expression)
      .with_field("context")
      .max_results(500)
      .execute();

    const grouped = {};

    result.resources.forEach((img) => {
      const folder = img.asset_folder;

      if (!folder || !folder.startsWith("gallery/")) return;

      const parts = folder.split("/");
      const album = parts[1]; // e.g. "may26"

      if (!album) return;

      if (!grouped[album]) {
        grouped[album] = {
          title: album
            .replace(/([a-z])([0-9])/i, "$1 $2")
            .replace(/\b\w/g, (l) => l.toUpperCase()),

          cover: img.public_id,
          photos: [],
        };
      }

      grouped[album].photos.push({
        src: img.public_id,
        caption: (img.context?.caption || "").replace(/\\n/g, "\n"),
        spotify: img.context?.alt || "",
        city: img.context?.city || "",
      });
    });

    return res.status(200).json(Object.values(grouped));
  } catch (err) {
    console.error("Gallery API error:", err);
    return res.status(500).json({ error: err.message });
  }
}