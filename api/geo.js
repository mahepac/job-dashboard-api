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
          "cookie": `li_at=${process.env.LI_AT}`,
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "accept": "application/json",
          "accept-language": "en-US,en;q=0.9",
          "x-restli-protocol-version": "2.0.0"
        }
      }
    );

    const text = await response.text();

    try {
      const data = JSON.parse(text);

      const loc = data.elements?.find(e => e.hitType === "LOCATION");

      if (loc) {
        return res.status(200).json({
          name: loc.title.text,
          geoId: loc.targetUrn.split(":").pop()
        });
      } else {
        return res.status(200).json(null);
      }

    } catch (e) {
      return res.status(500).json({
        error: "Not JSON",
        preview: text.slice(0, 300)
      });
    }

  } catch (err) {
    return res.status(500).json({ error: "Fetch failed" });
  }
}
