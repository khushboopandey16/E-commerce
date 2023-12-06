const multer =require('multer');
const storage=multer.memoryStorage()

 exports.fileUploads=multer({
    storage
}).array('files')

// export default fileUploads;
