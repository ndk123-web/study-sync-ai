import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/study-sync', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixEnrollmentIndexes = async () => {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    const collection = db.collection('enrollmentcourses');
    
    console.log('🔍 Checking existing indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => ({ name: idx.name, key: idx.key })));
    
    // Drop any existing indexes on userId alone
    const problematicIndexes = indexes.filter(idx => 
      idx.key && 
      Object.keys(idx.key).length === 1 && 
      idx.key.userId && 
      idx.name !== '_id_'
    );
    
    for (const index of problematicIndexes) {
      console.log(`🗑️  Dropping problematic index: ${index.name}`);
      await collection.dropIndex(index.name);
    }
    
    // Create the correct compound unique index
    console.log('✨ Creating compound unique index on userId + courseId...');
    await collection.createIndex(
      { userId: 1, courseId: 1 }, 
      { unique: true, name: 'userId_courseId_unique' }
    );
    
    console.log('✅ Successfully fixed enrollment indexes!');
    console.log('📋 Final indexes:');
    const finalIndexes = await collection.indexes();
    console.log(finalIndexes.map(idx => ({ name: idx.name, key: idx.key, unique: idx.unique })));
    
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

fixEnrollmentIndexes();
