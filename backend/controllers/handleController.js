import file from "../models/file.js"
export const rename = async (req, res) => {
    try { 
        const { id } = req.params
        const { newName } = req.body 
        if (!newName || newName.trim() === "") {
            return res.status(404).json({ message: "enter the name" })
        }
        const File = await file.findById(id)
        if (!File) {
            return res.status(404).json({ message: "File not found" });
        }

        File.name = newName.trim()
        console.log("fileee",File.name)
        await File.save()
        return res.status(201).json({
            message: "name chaned",
            File
        })
    }
    catch (e) {

        res.status(500).json({ message: "Rename failed" });
    }
}
export const deleteFile=async(req,res)=>{
    try{
        const {id}=req.params
        const filedoc=await file.findById(id)
        if(!filedoc){
            return res.status(404).json({message:"file not found"})
        }
        await file.findByIdAndDelete(id)

    res.status(200).json({ message: "File deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Delete failed" });
  }
};