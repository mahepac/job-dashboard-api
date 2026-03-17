export default async function handler(req, res) {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const response = await fetch(
      `https://www.linkedin.com/voyager/api/typeahead/hits?q=blended&query=${encodeURIComponent(q)}`,
      {
        headers: {
          "csrf-token": "ajax:123456",
          "cookie": `li_at=${process.env.LI_AT}`
        }
      }
    );

    const data = await response.json();

    const loc = data.elements?.find(e => e.hitType === "LOCATION");

    if (loc) {
      return res.status(200).json({
        name: loc.title.text,
        geoId: loc.targetUrn.split(":").pop()
      });
    } else {
      return res.status(200).json(null);
    }

  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch geoId" });
  }
}
