import File from "../models/file.js"
import mongoose from "mongoose"
export const getDashboard = async (req, res) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(req.user.id)
        
        const TOTAL_STORAGE_GB = 10
        const aggregationResult = await File.aggregate([
            { $match: { userId: userObjectId } },
            {
                $facet: {
                    storageUsage: [
                        {
                            $group: {
                                _id: null,
                                totalUsedBytes: { $sum: "$size" }
                            }
                        }
                    ],
                    filesById: [
                        {
                            $group: {
                                _id: "$type",
                                fileCount: { $sum: 1 },
                                latestUploadDate: { $max: "$createdAt" }
                            }
                        }
                    ],
                    recentFiles: [
                        { $sort: { createdAt: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                createdAt: 1
                            }
                        }
                    ]
                }
            }
        ])
        const dashboardData = aggregationResult[0];
        const totalUsedBytes = dashboardData.storageUsage[0]?.totalUsedBytes || 0;
        const usedStorageGB = +(totalUsedBytes / (1024 ** 3)).toFixed(2);
        const usedStoragePercentage = Math.round(
            (usedStorageGB / TOTAL_STORAGE_GB) * 100
        );
        const formatFileTypeSummary = (fileType) => {
            const typeSummary = dashboardData.filesById.find(
                (group) => 
                    group._id === fileType
            
            )
            return {
                files: typeSummary?.fileCount || 0,
                date: typeSummary?.latestUploadDate
                    ? new Date(typeSummary.latestUploadDate).toLocaleString()
                    : "-"
            };
        };
        res.json({
            storage: {
                total: TOTAL_STORAGE_GB,
                used: usedStorageGB,
                usedPercentage: usedStoragePercentage
            },
            documents: formatFileTypeSummary("document"),
            images: formatFileTypeSummary("image"),
            videos: formatFileTypeSummary("video"),
            others: formatFileTypeSummary("other"),
            recent: dashboardData.recentFiles.map((file) => ({
                id: file._id,
                name: file.name,
                date: new Date(file.createdAt).toLocaleString()
            }))
        });
    } catch (e) {

        res.status(500).json({ message: "Dashboard fetch failed" });
    }
}