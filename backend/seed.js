const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Question = require('./models/Question');
const Admin = require('./models/Admin');

// Sample questions for each level
const sampleQuestions = [
  // Easy Level (ages 5-7)
  {
    question: 'Nani aliunda dunia?',
    options: ['Yesu', 'Mungu', 'Malaika', 'Mtu'],
    correctAnswer: 'Mungu',
    level: 'Easy',
    bibleVerse: 'Mwanzo 1:1 - Hapo mwanzo Mungu aliunda mbingu na dunia.'
  },
  {
    question: 'Yesu alizaliwa wapi?',
    options: ['Yerusalemu', 'Bethlehemu', 'Nazareti', 'Misri'],
    correctAnswer: 'Bethlehemu',
    level: 'Easy',
    bibleVerse: 'Mathayo 2:1 - Yesu alizaliwa Bethlehemu ya Yuda.'
  },
  {
    question: 'Nani aliokoa watoto wa Israeli kutoka Misri?',
    options: ['Abrahamu', 'Musa', 'Daudi', 'Yosefu'],
    correctAnswer: 'Musa',
    level: 'Easy',
    bibleVerse: 'Kutoka 3:10 - Mungu alimtuma Musa kuwakomboa watoto wa Israeli.'
  },
  {
    question: 'Mfalme Daudi alikuwa mtu mjanja akiwa mdogo kwa sababu?',
    options: ['Aliogopa', 'Alipiga simba na dubu', 'Alikuwa na silaha', 'Alikuwa mkubwa'],
    correctAnswer: 'Alipiga simba na dubu',
    level: 'Easy',
    bibleVerse: '1 Samweli 17:34-37 - Daudi alikuwa amewalinda kondoo zake dhidi ya simba na dubu.'
  },
  {
    question: 'Yesu aliokoa wapi wanafunzi wake kutoka dhoruba?',
    options: ['Zamani', 'Mlimani', 'Maziwani', 'Baharini'],
    correctAnswer: 'Baharini',
    level: 'Easy',
    bibleVerse: 'Marko 4:39 - Yesu alisimama na kuikomesha dhoruba kwa neno.'
  },
  
  // Medium Level (ages 8-10)
  {
    question: 'Nani aliingia kwenye kisiwa cha nyani kwa sababu aliuiga Mungu?',
    options: ['Yona', 'Noa', 'Musa', 'Abrahamu'],
    correctAnswer: 'Yona',
    level: 'Medium',
    bibleVerse: 'Yona 1:17 - Mungu akamwelekeza nyani mkubwa kummeza Yona.'
  },
  {
    question: 'Yesu alifanya miujiza ya kwanza wapi?',
    options: ['Kana', 'Yerusalemu', 'Nazareti', 'Bethlehemu'],
    correctAnswer: 'Kana',
    level: 'Medium',
    bibleVerse: 'Yohana 2:11 - Hii ndiyo miujiza ya kwanza Yesu aliyofanya huko Kana.'
  },
  {
    question: 'Nani aliandika zaidi ya Zaburi?',
    options: ['Musa', 'Yeremia', 'Daudi', 'Isaya'],
    correctAnswer: 'Daudi',
    level: 'Medium',
    bibleVerse: 'Zaburi 23:1 - Bwana ndiye mchungaji wangu, sitahitaji kitu.'
  },
  {
    question: 'Nani aliwaonya watu wa Sodoma na Gomora?',
    options: ['Noa', 'Abrahamu', 'Loti', 'Musa'],
    correctAnswer: 'Loti',
    level: 'Medium',
    bibleVerse: 'Mwanzo 19:15-16 - Malaika walimwokoa Loti na familia yake.'
  },
  {
    question: 'Yesu alikuwa na wanafunzi wangapi?',
    options: ['10', '12', '15', '20'],
    correctAnswer: '12',
    level: 'Medium',
    bibleVerse: 'Mathayo 10:1 - Yesu aliwaalika wale kumi na wawili wanafunzi wake.'
  },
  
  // Hard Level (ages 11-13)
  {
    question: 'Nani aliandika kitabu cha kwanza cha Biblia?',
    options: ['Musa', 'Daudi', 'Abrahamu', 'Noa'],
    correctAnswer: 'Musa',
    level: 'Hard',
    bibleVerse: 'Mwanzo 1:1 - Musa aliandika kitabu cha Mwanzo.'
  },
  {
    question: 'Yesu alipokuwa msalabani, nani alimwambia "Ukweli, huyu ni Mwana wa Mungu"?',
    options: ['Mwanajeshi', 'Mfalme Herode', 'Pilato', 'Yosefu'],
    correctAnswer: 'Mwanajeshi',
    level: 'Hard',
    bibleVerse: 'Marko 15:39 - Mwanajeshi alipomwona Yesu akifa, akasema "Huyu hakika alikuwa Mwana wa Mungu!"'
  },
  {
    question: 'Nani alikuwa nabii wa kwanza katika Agano Jipya?',
    options: ['Yohana Mbatizaji', 'Peto', 'Paulo', 'Yakobo'],
    correctAnswer: 'Yohana Mbatizaji',
    level: 'Hard',
    bibleVerse: 'Mathayo 3:1-3 - Yohana Mbatizaji alikuwa nabii aliyemtayarishia Yesu njia.'
  },
  {
    question: 'Mungu aliwaahidi Ibrahim na Sara nini?',
    options: ['Fedha', 'Nchi', 'Mwana', 'Nyumba'],
    correctAnswer: 'Mwana',
    level: 'Hard',
    bibleVerse: 'Mwanzo 17:19 - Mungu aliwaahidi Ibrahim na Sara mwana, na hata ukoo wote.'
  },
  {
    question: 'Nani aliandika zaidi ya vitabu vya Agano Jipya?',
    options: ['Yohana', 'Peto', 'Paulo', 'Yakobo'],
    correctAnswer: 'Paulo',
    level: 'Hard',
    bibleVerse: 'Paulo aliandika Waraka kwa Warumi, Wakorintho, Wagalatia, na mengine mengi.'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bible-quiz');
    console.log('✅ Connected to MongoDB');

    // Clear existing questions (optional - comment out if you want to keep existing data)
    // await Question.deleteMany({});
    // console.log('🗑️  Cleared existing questions');

    // Insert sample questions
    const existingQuestions = await Question.countDocuments();
    if (existingQuestions === 0) {
      await Question.insertMany(sampleQuestions);
      console.log(`✅ Seeded ${sampleQuestions.length} questions`);
    } else {
      console.log(`ℹ️  Questions already exist (${existingQuestions} questions found)`);
    }

    // Create/Update default admin (username: dmaestro, password: 1234dmaestro)
    // Delete old admin accounts first
    await Admin.deleteMany({ username: { $in: ['admin', 'dmaestro'] } });
    console.log('🗑️  Removed old admin accounts');
    
    // Create new admin account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('1234dmaestro', salt);
    
    await Admin.create({
      username: 'dmaestro',
      password: hashedPassword
    });
    console.log('✅ Created admin account (username: dmaestro, password: 1234dmaestro)');

    console.log('🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

