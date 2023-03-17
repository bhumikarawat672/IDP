import mongoose from 'mongoose';

const fileSchema = mongoose.Schema({
  industryName: String,
  buisnessProcess: String,
  customerID: String,
  file: String
});

const file = mongoose.model('file', fileSchema);

export default file;
