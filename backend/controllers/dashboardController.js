import File from "../models/file.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const files = await File.find({ userId }).sort({ createdAt: -1 });

    const totalStorage = 10;  
    const usedBytes = files.reduce((sum, f) => sum + f.size, 0);
    const usedGB = +(usedBytes / (1024 * 1024 * 1024)).toFixed(2);
    const usedPercentage = Math.round((usedGB / totalStorage) * 100);

    const group = (type) => {
      const filtered = files.filter(f => f.type === type);
      return {
        files: filtered.length,
        date: filtered[0]?.createdAt?.toLocaleString() || "-"
      };
    };

    res.json({
      storage: {
        total: totalStorage,
        used: usedGB,
        usedPercentage
      },
      documents: group("document"),
      images: group("image"),
      viau: group("viau"),
      others: group("other"),
      recent: files.slice(0, 5).map(f => ({
        id: f._id,
        name: f.name,
        date: f.createdAt.toLocaleString()
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};
