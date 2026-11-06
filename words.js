// words.js — the built-in word decks ("levels"). Every question in the game comes from here
// (or, later, from a teacher's own deck).
//
// Each level is a deck: a name in English and Hebrew, plus a list of words or sentences.
// The host picks the deck in the lobby, and everyone in the room plays with it.
//
// HOW TO ADD A WORD: copy any line inside a level, paste it, and change it. For example:
//     { english: "horse", hebrew: "סוּס" },
//
// Optional extras on a line:
//   wrong: tricky wrong answers (wrong gender, missing אֶת, wrong prefix, wrong tense...).
//          If you give fewer than 3, the game fills in other answers from the same level.
//   hint:  shown under the English in the question, e.g. the infinitive: hint: "לֶאֱכֹל"
// Don't forget the comma at the end of each line!
//
// English "you" and "they" say (m.) or (f.) when the Hebrew depends on it.
// ⚠️ Please have a Hebrew teacher double-check the nikud (vowel marks).

const LEVELS = [
  {
    id: "level-1", english: "Nouns", hebrew: "שְׁמוֹת עֶצֶם",
    words: [
      { english: "dog", hebrew: "כֶּלֶב" },
      { english: "cat", hebrew: "חָתוּל" },
      { english: "house", hebrew: "בַּיִת" },
      { english: "book", hebrew: "סֵפֶר" },
      { english: "water", hebrew: "מַיִם" },
      { english: "bread", hebrew: "לֶחֶם" },
      { english: "boy", hebrew: "יֶלֶד", wrong: ["יַלְדָּה"] },
      { english: "girl", hebrew: "יַלְדָּה", wrong: ["יֶלֶד"] },
      { english: "dad", hebrew: "אַבָּא", wrong: ["אִמָּא"] },
      { english: "mom", hebrew: "אִמָּא", wrong: ["אַבָּא"] },
      { english: "family", hebrew: "מִשְׁפָּחָה" },
      { english: "friend", hebrew: "חָבֵר" },
      { english: "school", hebrew: "בֵּית סֵפֶר", wrong: ["סֵפֶר"] },
      { english: "teacher", hebrew: "מוֹרֶה" },
      { english: "table", hebrew: "שֻׁלְחָן" },
      { english: "chair", hebrew: "כִּסֵּא" },
      { english: "door", hebrew: "דֶּלֶת" },
      { english: "window", hebrew: "חַלּוֹן" },
      { english: "bed", hebrew: "מִטָּה" },
      { english: "car", hebrew: "מְכוֹנִית" },
      { english: "tree", hebrew: "עֵץ" },
      { english: "flower", hebrew: "פֶּרַח" },
      { english: "sun", hebrew: "שֶׁמֶשׁ", wrong: ["יָרֵחַ"] },
      { english: "moon", hebrew: "יָרֵחַ", wrong: ["שֶׁמֶשׁ"] },
      { english: "sea", hebrew: "יָם" },
      { english: "river", hebrew: "נָהָר" },
      { english: "mountain", hebrew: "הַר" },
      { english: "city", hebrew: "עִיר" },
      { english: "street", hebrew: "רְחוֹב" },
      { english: "food", hebrew: "אֹכֶל" },
      { english: "apple", hebrew: "תַּפּוּחַ" },
      { english: "milk", hebrew: "חָלָב" },
      { english: "egg", hebrew: "בֵּיצָה" },
      { english: "day", hebrew: "יוֹם", wrong: ["לַיְלָה"] },
      { english: "night", hebrew: "לַיְלָה", wrong: ["יוֹם"] },
      { english: "morning", hebrew: "בֹּקֶר" },
      { english: "hello / peace", hebrew: "שָׁלוֹם" },
      { english: "thank you", hebrew: "תּוֹדָה", wrong: ["בְּבַקָּשָׁה"] },
      { english: "please", hebrew: "בְּבַקָּשָׁה", wrong: ["תּוֹדָה"] },
      { english: "yes", hebrew: "כֵּן", wrong: ["לֹא"] },
      { english: "no", hebrew: "לֹא", wrong: ["כֵּן"] },
      { english: "flag", hebrew: "דֶּגֶל" },
      { english: "king", hebrew: "מֶלֶךְ" },
      { english: "sword", hebrew: "חֶרֶב" },
      { english: "hammer", hebrew: "פַּטִּישׁ" },
    ],
  },
  {
    id: "level-2", english: "Adjectives", hebrew: "שְׁמוֹת תֹּאַר",
    words: [
      { english: "big", hebrew: "גָּדוֹל", wrong: ["קָטָן"] },
      { english: "small", hebrew: "קָטָן", wrong: ["גָּדוֹל"] },
      { english: "good", hebrew: "טוֹב", wrong: ["רַע"] },
      { english: "bad", hebrew: "רַע", wrong: ["טוֹב"] },
      { english: "new", hebrew: "חָדָשׁ", wrong: ["יָשָׁן"] },
      { english: "old (things)", hebrew: "יָשָׁן", wrong: ["חָדָשׁ"] },
      { english: "red", hebrew: "אָדֹם" },
      { english: "blue", hebrew: "כָּחֹל" },
      { english: "green", hebrew: "יָרֹק" },
      { english: "white", hebrew: "לָבָן", wrong: ["שָׁחֹר"] },
      { english: "black", hebrew: "שָׁחֹר", wrong: ["לָבָן"] },
      { english: "a red bed", hebrew: "מִטָּה אֲדֻמָּה", wrong: ["מִטָּה אָדֹם", "אֲדֻמָּה מִטָּה", "מִטָּה כְּחֻלָּה"] },
      { english: "a big dog", hebrew: "כֶּלֶב גָּדוֹל", wrong: ["כֶּלֶב גְּדוֹלָה", "גָּדוֹל כֶּלֶב", "כֶּלֶב קָטָן"] },
      { english: "a small cat", hebrew: "חָתוּל קָטָן", wrong: ["חָתוּל קְטַנָּה", "קָטָן חָתוּל", "חָתוּל גָּדוֹל"] },
      { english: "a blue car", hebrew: "מְכוֹנִית כְּחֻלָּה", wrong: ["מְכוֹנִית כָּחֹל", "כְּחֻלָּה מְכוֹנִית", "מְכוֹנִית יְרֻקָּה"] },
      { english: "a green tree", hebrew: "עֵץ יָרֹק", wrong: ["עֵץ יְרֻקָּה", "יָרֹק עֵץ", "עֵץ אָדֹם"] },
      { english: "a new book", hebrew: "סֵפֶר חָדָשׁ", wrong: ["סֵפֶר חֲדָשָׁה", "חָדָשׁ סֵפֶר", "סֵפֶר יָשָׁן"] },
      { english: "a white door", hebrew: "דֶּלֶת לְבָנָה", wrong: ["דֶּלֶת לָבָן", "לְבָנָה דֶּלֶת", "דֶּלֶת שְׁחֹרָה"] },
      { english: "a black chair", hebrew: "כִּסֵּא שָׁחֹר", wrong: ["כִּסֵּא שְׁחֹרָה", "שָׁחֹר כִּסֵּא", "כִּסֵּא לָבָן"] },
      { english: "a good friend", hebrew: "חָבֵר טוֹב", wrong: ["חָבֵר טוֹבָה", "טוֹב חָבֵר", "חָבֵר רַע"] },
      { english: "a big family", hebrew: "מִשְׁפָּחָה גְּדוֹלָה", wrong: ["מִשְׁפָּחָה גָּדוֹל", "גְּדוֹלָה מִשְׁפָּחָה", "מִשְׁפָּחָה קְטַנָּה"] },
      { english: "good morning", hebrew: "בֹּקֶר טוֹב", wrong: ["בֹּקֶר טוֹבָה", "טוֹב בֹּקֶר", "לַיְלָה טוֹב"] },
      { english: "good night", hebrew: "לַיְלָה טוֹב", wrong: ["לַיְלָה טוֹבָה", "טוֹב לַיְלָה", "בֹּקֶר טוֹב"] },
      { english: "a red apple", hebrew: "תַּפּוּחַ אָדֹם", wrong: ["תַּפּוּחַ אֲדֻמָּה", "אָדֹם תַּפּוּחַ", "תַּפּוּחַ יָרֹק"] },
      { english: "a little girl", hebrew: "יַלְדָּה קְטַנָּה", wrong: ["יַלְדָּה קָטָן", "קְטַנָּה יַלְדָּה", "יֶלֶד קָטָן"] },
    ],
  },
  {
    id: "level-3", english: "Prefixes: the (הַ) and (וְ)", hebrew: "הַ־ וְ־",
    words: [
      { english: "the dog", hebrew: "הַכֶּלֶב", wrong: ["כֶּלֶב", "וְכֶלֶב", "הַחָתוּל"] },
      { english: "the house", hebrew: "הַבַּיִת", wrong: ["בַּיִת", "וּבַיִת", "הַבָּתִּים"] },
      { english: "the city", hebrew: "הָעִיר", wrong: ["עִיר", "וְעִיר", "הָהָר"] },
      { english: "the man", hebrew: "הָאִישׁ", wrong: ["אִישׁ", "הָאִשָּׁה", "וְאִישׁ"] },
      { english: "the woman", hebrew: "הָאִשָּׁה", wrong: ["אִשָּׁה", "הָאִישׁ", "וְאִשָּׁה"] },
      { english: "the children", hebrew: "הַיְלָדִים", wrong: ["יְלָדִים", "הַיֶּלֶד", "וִילָדִים"] },
      { english: "a dog and a cat", hebrew: "כֶּלֶב וְחָתוּל", wrong: ["כֶּלֶב חָתוּל", "חָתוּל וְכֶלֶב", "הַכֶּלֶב וְהַחָתוּל"] },
      { english: "bread and milk", hebrew: "לֶחֶם וְחָלָב", wrong: ["לֶחֶם חָלָב", "חָלָב וְלֶחֶם", "לֶחֶם אוֹ חָלָב"] },
      { english: "bread or milk", hebrew: "לֶחֶם אוֹ חָלָב", wrong: ["לֶחֶם וְחָלָב", "לֶחֶם חָלָב", "חָלָב אוֹ לֶחֶם"] },
      { english: "the man and the woman", hebrew: "הָאִישׁ וְהָאִשָּׁה", wrong: ["אִישׁ וְאִשָּׁה", "הָאִשָּׁה וְהָאִישׁ", "הָאִישׁ הָאִשָּׁה"] },
      { english: "the teacher and the children", hebrew: "הַמּוֹרֶה וְהַיְלָדִים", wrong: ["מוֹרֶה וִילָדִים", "הַיְלָדִים וְהַמּוֹרֶה", "הַמּוֹרֶה הַיְלָדִים"] },
      { english: "a table and a chair", hebrew: "שֻׁלְחָן וְכִסֵּא", wrong: ["כִּסֵּא וְשֻׁלְחָן", "שֻׁלְחָן כִּסֵּא", "הַשֻּׁלְחָן וְהַכִּסֵּא"] },
      { english: "the new car", hebrew: "הַמְּכוֹנִית הַחֲדָשָׁה", wrong: ["הַמְּכוֹנִית חֲדָשָׁה", "מְכוֹנִית הַחֲדָשָׁה", "הַמְּכוֹנִית הֶחָדָשׁ"] },
      { english: "the big house", hebrew: "הַבַּיִת הַגָּדוֹל", wrong: ["הַבַּיִת גָּדוֹל", "בַּיִת הַגָּדוֹל", "הַבַּיִת הַקָּטָן"] },
    ],
  },
  {
    id: "level-4", english: "Sentences without verbs", hebrew: "מִשְׁפָּטִים בְּלִי פֹּעַל",
    words: [
      { english: "I (m.) am happy", hebrew: "אֲנִי שָׂמֵחַ", wrong: ["אֲנִי שְׂמֵחָה", "הוּא שָׂמֵחַ", "אֲנִי עָצוּב"] },
      { english: "she is sad", hebrew: "הִיא עֲצוּבָה", wrong: ["הִיא עָצוּב", "הוּא עָצוּב", "הִיא שְׂמֵחָה"] },
      { english: "he is tired", hebrew: "הוּא עָיֵף", wrong: ["הוּא עֲיֵפָה", "הִיא עֲיֵפָה", "הוּא שָׂמֵחַ"] },
      { english: "they (m.) are green", hebrew: "הֵם יְרֻקִּים", wrong: ["הֵם יָרֹק", "הֵן יְרֻקּוֹת", "הֵם כְּחֻלִּים"] },
      { english: "the box is empty", hebrew: "הַקֻּפְסָה רֵיקָה", wrong: ["הַקֻּפְסָה רֵיק", "הַקֻּפְסָה הָרֵיקָה", "הַקֻּפְסָה מְלֵאָה"] },
      { english: "the house is big", hebrew: "הַבַּיִת גָּדוֹל", wrong: ["הַבַּיִת הַגָּדוֹל", "הַבַּיִת גְּדוֹלָה", "הַבַּיִת קָטָן"] },
      { english: "the coffee is hot", hebrew: "הַקָּפֶה חַם", wrong: ["הַקָּפֶה הַחַם", "הַקָּפֶה חַמָּה", "הַקָּפֶה קַר"] },
      { english: "the water is cold", hebrew: "הַמַּיִם קָרִים", wrong: ["הַמַּיִם קַר", "הַמַּיִם הַקָּרִים", "הַמַּיִם חַמִּים"] },
      { english: "we (m.) are students", hebrew: "אֲנַחְנוּ תַּלְמִידִים", wrong: ["אֲנַחְנוּ תַּלְמִיד", "הֵם תַּלְמִידִים", "אֲנַחְנוּ מוֹרִים"] },
      { english: "you (m.) are tall", hebrew: "אַתָּה גָּבוֹהַּ", wrong: ["אַתְּ גְּבוֹהָה", "אַתָּה נָמוּךְ", "הוּא גָּבוֹהַּ"] },
      { english: "you (f.) are smart", hebrew: "אַתְּ חֲכָמָה", wrong: ["אַתָּה חָכָם", "אַתְּ חָכָם", "הִיא חֲכָמָה"] },
      { english: "the girls are happy", hebrew: "הַיְלָדוֹת שְׂמֵחוֹת", wrong: ["הַיְלָדוֹת שְׂמֵחִים", "הַיְלָדִים שְׂמֵחִים", "הַיְלָדוֹת עֲצוּבוֹת"] },
      { english: "the food is good", hebrew: "הָאֹכֶל טוֹב", wrong: ["הָאֹכֶל טוֹבָה", "הָאֹכֶל הַטּוֹב", "הָאֹכֶל רַע"] },
    ],
  },
  {
    id: "level-5", english: "Prefixes: in (בְּ), to (לְ), from (מִ)", hebrew: "בְּ־ לְ־ מִ־",
    words: [
      { english: "in the house", hebrew: "בַּבַּיִת", wrong: ["בְּבַיִת", "לַבַּיִת", "מֵהַבַּיִת"] },
      { english: "in a house", hebrew: "בְּבַיִת", wrong: ["בַּבַּיִת", "לְבַיִת", "מִבַּיִת"] },
      { english: "to the city", hebrew: "לָעִיר", wrong: ["בָּעִיר", "מֵהָעִיר", "לְעִיר"] },
      { english: "from the city", hebrew: "מֵהָעִיר", wrong: ["לָעִיר", "בָּעִיר", "מֵעִיר"] },
      { english: "in Jerusalem", hebrew: "בִּירוּשָׁלַיִם", wrong: ["לִירוּשָׁלַיִם", "מִירוּשָׁלַיִם", "יְרוּשָׁלַיִם"] },
      { english: "to Tel Aviv", hebrew: "לְתֵל אָבִיב", wrong: ["בְּתֵל אָבִיב", "מִתֵּל אָבִיב", "תֵּל אָבִיב"] },
      { english: "from Haifa", hebrew: "מֵחֵיפָה", wrong: ["לְחֵיפָה", "בְּחֵיפָה", "חֵיפָה"] },
      { english: "in the car", hebrew: "בַּמְּכוֹנִית", wrong: ["לַמְּכוֹנִית", "מֵהַמְּכוֹנִית", "בִּמְכוֹנִית"] },
      { english: "to school", hebrew: "לְבֵית הַסֵּפֶר", wrong: ["בְּבֵית הַסֵּפֶר", "מִבֵּית הַסֵּפֶר", "לַבֵּית סֵפֶר"] },
      { english: "from home", hebrew: "מֵהַבַּיִת", wrong: ["לַבַּיִת", "בַּבַּיִת", "מִבַּיִת"] },
      { english: "for Dad", hebrew: "לְאַבָּא", wrong: ["בְּאַבָּא", "מֵאַבָּא", "אַבָּא"] },
      { english: "the book is in the bag", hebrew: "הַסֵּפֶר בַּתִּיק", wrong: ["הַסֵּפֶר לַתִּיק", "הַסֵּפֶר מֵהַתִּיק", "הַתִּיק בַּסֵּפֶר"] },
      { english: "in the morning", hebrew: "בַּבֹּקֶר", wrong: ["לַבֹּקֶר", "מֵהַבֹּקֶר", "בְּבֹקֶר"] },
    ],
  },
  {
    id: "level-6", english: "Infinitives (to ...)", hebrew: "שְׁמוֹת פֹּעַל",
    words: [
      { english: "to work", hebrew: "לַעֲבֹד", wrong: ["עוֹבֵד", "עֲבוֹדָה"] },
      { english: "to do", hebrew: "לַעֲשׂוֹת", wrong: ["עוֹשֶׂה"] },
      { english: "to live (be alive)", hebrew: "לִחְיוֹת", wrong: ["חַי", "חַיִּים"] },
      { english: "to live (reside)", hebrew: "לָגוּר", wrong: ["גָּר", "לִחְיוֹת"] },
      { english: "to eat", hebrew: "לֶאֱכֹל", wrong: ["אוֹכֵל", "אֹכֶל"] },
      { english: "to drink", hebrew: "לִשְׁתּוֹת", wrong: ["שׁוֹתֶה"] },
      { english: "to go / to walk", hebrew: "לָלֶכֶת", wrong: ["הוֹלֵךְ"] },
      { english: "to write", hebrew: "לִכְתֹּב", wrong: ["כּוֹתֵב", "מִכְתָּב"] },
      { english: "to read", hebrew: "לִקְרֹא", wrong: ["קוֹרֵא"] },
      { english: "to speak", hebrew: "לְדַבֵּר", wrong: ["מְדַבֵּר"] },
      { english: "to learn / to study", hebrew: "לִלְמֹד", wrong: ["לוֹמֵד", "לְלַמֵּד"] },
      { english: "to sleep", hebrew: "לִישֹׁן", wrong: ["יָשֵׁן"] },
      { english: "to play", hebrew: "לְשַׂחֵק", wrong: ["מְשַׂחֵק"] },
      { english: "to see", hebrew: "לִרְאוֹת", wrong: ["רוֹאֶה"] },
      { english: "to hear", hebrew: "לִשְׁמֹעַ", wrong: ["שׁוֹמֵעַ"] },
      { english: "to buy", hebrew: "לִקְנוֹת", wrong: ["קוֹנֶה"] },
    ],
  },
  {
    id: "level-7", english: "Want & like + infinitive", hebrew: "רוֹצֶה, אוֹהֵב + שֵׁם פֹּעַל",
    words: [
      { english: "he wants to live", hebrew: "הוּא רוֹצֶה לִחְיוֹת", wrong: ["הוּא רוֹצָה לִחְיוֹת", "הוּא רוֹצֶה חַי", "הִיא רוֹצָה לִחְיוֹת"] },
      { english: "she wants to eat", hebrew: "הִיא רוֹצָה לֶאֱכֹל", wrong: ["הִיא רוֹצֶה לֶאֱכֹל", "הִיא רוֹצָה אוֹכֶלֶת", "הוּא רוֹצֶה לֶאֱכֹל"] },
      { english: "they (m.) like to eat", hebrew: "הֵם אוֹהֲבִים לֶאֱכֹל", wrong: ["הֵם אוֹהֵב לֶאֱכֹל", "הֵן אוֹהֲבוֹת לֶאֱכֹל", "הֵם אוֹהֲבִים אוֹכְלִים"] },
      { english: "I (m.) want to sleep", hebrew: "אֲנִי רוֹצֶה לִישֹׁן", wrong: ["אֲנִי רוֹצָה לִישֹׁן", "אֲנִי רוֹצֶה יָשֵׁן", "אֲנִי אוֹהֵב לִישֹׁן"] },
      { english: "I (f.) like to read", hebrew: "אֲנִי אוֹהֶבֶת לִקְרֹא", wrong: ["אֲנִי אוֹהֵב לִקְרֹא", "אֲנִי רוֹצָה לִקְרֹא", "אֲנִי אוֹהֶבֶת קוֹרֵאת"] },
      { english: "we (m.) want to play", hebrew: "אֲנַחְנוּ רוֹצִים לְשַׂחֵק", wrong: ["אֲנַחְנוּ רוֹצֶה לְשַׂחֵק", "אֲנַחְנוּ אוֹהֲבִים לְשַׂחֵק", "אֲנַחְנוּ רוֹצִים מְשַׂחֲקִים"] },
      { english: "you (m.) want to drink", hebrew: "אַתָּה רוֹצֶה לִשְׁתּוֹת", wrong: ["אַתְּ רוֹצָה לִשְׁתּוֹת", "אַתָּה רוֹצֶה לֶאֱכֹל", "אַתָּה רוֹצֶה שׁוֹתֶה"] },
      { english: "you (f.) like to write", hebrew: "אַתְּ אוֹהֶבֶת לִכְתֹּב", wrong: ["אַתָּה אוֹהֵב לִכְתֹּב", "אַתְּ אוֹהֵב לִכְתֹּב", "אַתְּ אוֹהֶבֶת לִקְרֹא"] },
      { english: "the children want to go", hebrew: "הַיְלָדִים רוֹצִים לָלֶכֶת", wrong: ["הַיְלָדִים רוֹצֶה לָלֶכֶת", "הַיְלָדִים רוֹצִים הוֹלְכִים", "הַיְלָדוֹת רוֹצוֹת לָלֶכֶת"] },
      { english: "she likes to speak Hebrew", hebrew: "הִיא אוֹהֶבֶת לְדַבֵּר עִבְרִית", wrong: ["הִיא אוֹהֵב לְדַבֵּר עִבְרִית", "הִיא אוֹהֶבֶת מְדַבֶּרֶת עִבְרִית", "הוּא אוֹהֵב לְדַבֵּר עִבְרִית"] },
      { english: "he doesn't want to work", hebrew: "הוּא לֹא רוֹצֶה לַעֲבֹד", wrong: ["לֹא הוּא רוֹצֶה לַעֲבֹד", "הוּא לֹא רוֹצָה לַעֲבֹד", "הוּא לֹא רוֹצֶה עוֹבֵד"] },
      { english: "we (m.) like to live in Israel", hebrew: "אֲנַחְנוּ אוֹהֲבִים לִחְיוֹת בְּיִשְׂרָאֵל", wrong: ["אֲנַחְנוּ אוֹהֲבִים לִחְיוֹת לְיִשְׂרָאֵל", "אֲנַחְנוּ אוֹהֵב לִחְיוֹת בְּיִשְׂרָאֵל", "אֲנַחְנוּ אוֹהֲבִים חַיִּים בְּיִשְׂרָאֵל"] },
    ],
  },
  {
    id: "level-8", english: "Present tense", hebrew: "הוֹוֶה",
    words: [
      { english: "he eats", hint: "לֶאֱכֹל", hebrew: "הוּא אוֹכֵל", wrong: ["הוּא אוֹכֶלֶת", "הֵם אוֹכְלִים", "הוּא לֶאֱכֹל"] },
      { english: "she eats", hint: "לֶאֱכֹל", hebrew: "הִיא אוֹכֶלֶת", wrong: ["הִיא אוֹכֵל", "הִיא אוֹכְלוֹת", "הוּא אוֹכֵל"] },
      { english: "they (m.) eat", hint: "לֶאֱכֹל", hebrew: "הֵם אוֹכְלִים", wrong: ["הֵם אוֹכֵל", "הֵן אוֹכְלוֹת", "הֵם אוֹכְלוֹת"] },
      { english: "I (m.) write", hint: "לִכְתֹּב", hebrew: "אֲנִי כּוֹתֵב", wrong: ["אֲנִי כּוֹתֶבֶת", "אֲנִי לִכְתֹּב", "אֲנִי כָּתַבְתִּי"] },
      { english: "she writes", hint: "לִכְתֹּב", hebrew: "הִיא כּוֹתֶבֶת", wrong: ["הִיא כּוֹתֵב", "הִיא כּוֹתְבוֹת", "הִיא לִכְתֹּב"] },
      { english: "we (m.) work", hint: "לַעֲבֹד", hebrew: "אֲנַחְנוּ עוֹבְדִים", wrong: ["אֲנַחְנוּ עוֹבֵד", "אֲנַחְנוּ לַעֲבֹד", "הֵם עוֹבְדִים"] },
      { english: "you (f.) speak", hint: "לְדַבֵּר", hebrew: "אַתְּ מְדַבֶּרֶת", wrong: ["אַתְּ מְדַבֵּר", "אַתָּה מְדַבֵּר", "אַתְּ לְדַבֵּר"] },
      { english: "he lives in Haifa", hint: "לָגוּר", hebrew: "הוּא גָּר בְּחֵיפָה", wrong: ["הוּא גָּרָה בְּחֵיפָה", "הוּא גָּר לְחֵיפָה", "הוּא לָגוּר בְּחֵיפָה"] },
      { english: "she goes to school", hint: "לָלֶכֶת", hebrew: "הִיא הוֹלֶכֶת לְבֵית הַסֵּפֶר", wrong: ["הִיא הוֹלֵךְ לְבֵית הַסֵּפֶר", "הִיא הוֹלֶכֶת בְּבֵית הַסֵּפֶר", "הִיא לָלֶכֶת לְבֵית הַסֵּפֶר"] },
      { english: "the girls read", hint: "לִקְרֹא", hebrew: "הַיְלָדוֹת קוֹרְאוֹת", wrong: ["הַיְלָדוֹת קוֹרְאִים", "הַיְלָדוֹת קוֹרֵאת", "הַיְלָדִים קוֹרְאִים"] },
      { english: "I (f.) drink coffee", hint: "לִשְׁתּוֹת", hebrew: "אֲנִי שׁוֹתָה קָפֶה", wrong: ["אֲנִי שׁוֹתֶה קָפֶה", "אֲנִי לִשְׁתּוֹת קָפֶה", "אֲנִי שׁוֹתָה הַקָּפֶה"] },
      { english: "they (m.) play in the park", hint: "לְשַׂחֵק", hebrew: "הֵם מְשַׂחֲקִים בַּפַּארְק", wrong: ["הֵם מְשַׂחֵק בַּפַּארְק", "הֵם מְשַׂחֲקִים לַפַּארְק", "הֵן מְשַׂחֲקוֹת בַּפַּארְק"] },
      { english: "he sleeps at night", hint: "לִישֹׁן", hebrew: "הוּא יָשֵׁן בַּלַּיְלָה", wrong: ["הוּא יְשֵׁנָה בַּלַּיְלָה", "הוּא לִישֹׁן בַּלַּיְלָה", "הוּא יָשֵׁן לַלַּיְלָה"] },
      { english: "we (m.) learn Hebrew", hint: "לִלְמֹד", hebrew: "אֲנַחְנוּ לוֹמְדִים עִבְרִית", wrong: ["אֲנַחְנוּ לוֹמֵד עִבְרִית", "אֲנַחְנוּ לִלְמֹד עִבְרִית", "אֲנַחְנוּ לוֹמְדוֹת עִבְרִית"] },
    ],
  },
  {
    id: "level-9", english: "Prefixes: that (שֶׁ) and when (כְּשֶׁ)", hebrew: "שֶׁ־ כְּשֶׁ־",
    words: [
      { english: "the boy who eats", hebrew: "הַיֶּלֶד שֶׁאוֹכֵל", wrong: ["הַיֶּלֶד אוֹכֵל", "יֶלֶד שֶׁאוֹכֵל", "הַיֶּלֶד שֶׁאוֹכֶלֶת"] },
      { english: "the girl who reads", hebrew: "הַיַּלְדָּה שֶׁקּוֹרֵאת", wrong: ["הַיַּלְדָּה קוֹרֵאת", "הַיַּלְדָּה שֶׁקּוֹרֵא", "הַיַּלְדָּה כְּשֶׁקּוֹרֵאת"] },
      { english: "the book that I (m.) am reading", hebrew: "הַסֵּפֶר שֶׁאֲנִי קוֹרֵא", wrong: ["הַסֵּפֶר אֲנִי קוֹרֵא", "הַסֵּפֶר שֶׁאֲנִי קוֹרֵאת", "סֵפֶר שֶׁאֲנִי קוֹרֵא"] },
      { english: "the man who works here", hebrew: "הָאִישׁ שֶׁעוֹבֵד כָּאן", wrong: ["הָאִישׁ עוֹבֵד כָּאן", "הָאִישׁ שֶׁעוֹבֶדֶת כָּאן", "הָאִישׁ כְּשֶׁעוֹבֵד כָּאן"] },
      { english: "I (m.) know that he is here", hebrew: "אֲנִי יוֹדֵעַ שֶׁהוּא כָּאן", wrong: ["אֲנִי יוֹדֵעַ הוּא כָּאן", "אֲנִי יוֹדַעַת שֶׁהוּא כָּאן", "אֲנִי יוֹדֵעַ כְּשֶׁהוּא כָּאן"] },
      { english: "she says that it's cold", hebrew: "הִיא אוֹמֶרֶת שֶׁקַּר", wrong: ["הִיא אוֹמֶרֶת קַר", "הִיא אוֹמֵר שֶׁקַּר", "הִיא אוֹמֶרֶת כְּשֶׁקַּר"] },
      { english: "when I (m.) eat", hebrew: "כְּשֶׁאֲנִי אוֹכֵל", wrong: ["שֶׁאֲנִי אוֹכֵל", "כְּשֶׁאֲנִי אוֹכֶלֶת", "כְּאֲנִי אוֹכֵל"] },
      { english: "when it rains", hebrew: "כְּשֶׁיּוֹרֵד גֶּשֶׁם", wrong: ["שֶׁיּוֹרֵד גֶּשֶׁם", "כְּשֶׁיּוֹרֶדֶת גֶּשֶׁם", "יוֹרֵד גֶּשֶׁם"] },
      { english: "like a dog", hebrew: "כְּמוֹ כֶּלֶב", wrong: ["כְּשֶׁכֶּלֶב", "שֶׁכֶּלֶב", "כֶּלֶב כְּמוֹ"] },
      { english: "the city where we (m.) live", hebrew: "הָעִיר שֶׁאֲנַחְנוּ גָּרִים בָּהּ", wrong: ["הָעִיר אֲנַחְנוּ גָּרִים", "הָעִיר שֶׁאֲנַחְנוּ גָּרִים לָהּ", "הָעִיר כְּשֶׁאֲנַחְנוּ גָּרִים בָּהּ"] },
    ],
  },
  {
    id: "level-10", english: "Present tense with אֶת", hebrew: "הוֹוֶה עִם אֶת",
    words: [
      { english: "I (m.) see the dog", hint: "לִרְאוֹת", hebrew: "אֲנִי רוֹאֶה אֶת הַכֶּלֶב", wrong: ["אֲנִי רוֹאֶה הַכֶּלֶב", "אֲנִי רוֹאֶה אֶת כֶּלֶב", "אֲנִי רוֹאָה אֶת הַכֶּלֶב"] },
      { english: "I (m.) see a dog", hint: "לִרְאוֹת", hebrew: "אֲנִי רוֹאֶה כֶּלֶב", wrong: ["אֲנִי רוֹאֶה אֶת כֶּלֶב", "אֲנִי רוֹאֶה אֶת הַכֶּלֶב", "אֲנִי רוֹאָה כֶּלֶב"] },
      { english: "she reads the book", hint: "לִקְרֹא", hebrew: "הִיא קוֹרֵאת אֶת הַסֵּפֶר", wrong: ["הִיא קוֹרֵאת הַסֵּפֶר", "הִיא קוֹרֵאת אֶת סֵפֶר", "הִיא קוֹרֵא אֶת הַסֵּפֶר"] },
      { english: "he loves Dana", hint: "לֶאֱהֹב", hebrew: "הוּא אוֹהֵב אֶת דָּנָה", wrong: ["הוּא אוֹהֵב דָּנָה", "הוּא אוֹהֵב אֶת הַדָּנָה", "הִיא אוֹהֶבֶת אֶת דָּנָה"] },
      { english: "we (m.) eat the apple", hint: "לֶאֱכֹל", hebrew: "אֲנַחְנוּ אוֹכְלִים אֶת הַתַּפּוּחַ", wrong: ["אֲנַחְנוּ אוֹכְלִים הַתַּפּוּחַ", "אֲנַחְנוּ אוֹכְלִים אֶת תַּפּוּחַ", "אֲנַחְנוּ אוֹכֵל אֶת הַתַּפּוּחַ"] },
      { english: "they (m.) buy bread", hint: "לִקְנוֹת", hebrew: "הֵם קוֹנִים לֶחֶם", wrong: ["הֵם קוֹנִים אֶת לֶחֶם", "הֵם קוֹנֶה לֶחֶם", "הֵם קוֹנִים הַלֶּחֶם"] },
      { english: "they (m.) buy the bread", hint: "לִקְנוֹת", hebrew: "הֵם קוֹנִים אֶת הַלֶּחֶם", wrong: ["הֵם קוֹנִים הַלֶּחֶם", "הֵם קוֹנִים אֶת לֶחֶם", "הֵן קוֹנוֹת אֶת הַלֶּחֶם"] },
      { english: "you (f.) open the door", hint: "לִפְתֹּחַ", hebrew: "אַתְּ פּוֹתַחַת אֶת הַדֶּלֶת", wrong: ["אַתְּ פּוֹתַחַת הַדֶּלֶת", "אַתְּ פּוֹתֵחַ אֶת הַדֶּלֶת", "אַתְּ פּוֹתַחַת אֶת דֶּלֶת"] },
      { english: "I (f.) hear the music", hint: "לִשְׁמֹעַ", hebrew: "אֲנִי שׁוֹמַעַת אֶת הַמּוּזִיקָה", wrong: ["אֲנִי שׁוֹמַעַת הַמּוּזִיקָה", "אֲנִי שׁוֹמֵעַ אֶת הַמּוּזִיקָה", "אֲנִי שׁוֹמַעַת אֶת מוּזִיקָה"] },
      { english: "the teacher (m.) writes the word", hint: "לִכְתֹּב", hebrew: "הַמּוֹרֶה כּוֹתֵב אֶת הַמִּלָּה", wrong: ["הַמּוֹרֶה כּוֹתֵב הַמִּלָּה", "הַמּוֹרֶה כּוֹתֵב אֶת מִלָּה", "הַמּוֹרֶה כּוֹתֶבֶת אֶת הַמִּלָּה"] },
      { english: "he knows the answer", hint: "לָדַעַת", hebrew: "הוּא יוֹדֵעַ אֶת הַתְּשׁוּבָה", wrong: ["הוּא יוֹדֵעַ הַתְּשׁוּבָה", "הוּא יוֹדֵעַ אֶת תְּשׁוּבָה", "הוּא יוֹדַעַת אֶת הַתְּשׁוּבָה"] },
    ],
  },
  {
    id: "level-11", english: "Past tense", hebrew: "עָבָר",
    words: [
      { english: "he ate", hint: "לֶאֱכֹל", hebrew: "הוּא אָכַל", wrong: ["הוּא אוֹכֵל", "הוּא אָכְלָה", "הוּא יֹאכַל"] },
      { english: "she ate", hint: "לֶאֱכֹל", hebrew: "הִיא אָכְלָה", wrong: ["הִיא אָכַל", "הִיא אוֹכֶלֶת", "הִיא תֹּאכַל"] },
      { english: "I wrote", hint: "לִכְתֹּב", hebrew: "כָּתַבְתִּי", wrong: ["כָּתַבְנוּ", "כָּתַב", "אֶכְתֹּב"] },
      { english: "we wrote", hint: "לִכְתֹּב", hebrew: "כָּתַבְנוּ", wrong: ["כָּתַבְתִּי", "כָּתְבוּ", "נִכְתֹּב"] },
      { english: "they went", hint: "לָלֶכֶת", hebrew: "הֵם הָלְכוּ", wrong: ["הֵם הוֹלְכִים", "הֵם הָלַךְ", "הֵם יֵלְכוּ"] },
      { english: "you (m.) worked", hint: "לַעֲבֹד", hebrew: "עָבַדְתָּ", wrong: ["עָבַדְתְּ", "עָבַדְתִּי", "תַּעֲבֹד"] },
      { english: "you (f.) spoke", hint: "לְדַבֵּר", hebrew: "דִּבַּרְתְּ", wrong: ["דִּבַּרְתָּ", "מְדַבֶּרֶת", "תְּדַבְּרִי"] },
      { english: "he slept", hint: "לִישֹׁן", hebrew: "הוּא יָשַׁן", wrong: ["הוּא יָשֵׁן", "הוּא יָשְׁנָה", "הוּא יִישַׁן"] },
      { english: "I learned Hebrew", hint: "לִלְמֹד", hebrew: "לָמַדְתִּי עִבְרִית", wrong: ["לָמַדְנוּ עִבְרִית", "אֲנִי לוֹמֵד עִבְרִית", "אֶלְמַד עִבְרִית"] },
      { english: "yesterday it rained", hint: "לָרֶדֶת", hebrew: "אֶתְמוֹל יָרַד גֶּשֶׁם", wrong: ["אֶתְמוֹל יוֹרֵד גֶּשֶׁם", "אֶתְמוֹל יֵרֵד גֶּשֶׁם", "אֶתְמוֹל יָרְדָה גֶּשֶׁם"] },
      { english: "we played in the park", hint: "לְשַׂחֵק", hebrew: "שִׂחַקְנוּ בַּפַּארְק", wrong: ["שִׂחַקְתִּי בַּפַּארְק", "מְשַׂחֲקִים בַּפַּארְק", "נְשַׂחֵק בַּפַּארְק"] },
      { english: "she bought bread", hint: "לִקְנוֹת", hebrew: "הִיא קָנְתָה לֶחֶם", wrong: ["הִיא קָנָה לֶחֶם", "הִיא קוֹנָה לֶחֶם", "הִיא תִּקְנֶה לֶחֶם"] },
    ],
  },
  {
    id: "level-12", english: "Past tense with אֶת", hebrew: "עָבָר עִם אֶת",
    words: [
      { english: "I wrote the letter", hint: "לִכְתֹּב", hebrew: "כָּתַבְתִּי אֶת הַמִּכְתָּב", wrong: ["כָּתַבְתִּי הַמִּכְתָּב", "כָּתַבְתִּי אֶת מִכְתָּב", "כָּתַבְנוּ אֶת הַמִּכְתָּב"] },
      { english: "she read the book", hint: "לִקְרֹא", hebrew: "הִיא קָרְאָה אֶת הַסֵּפֶר", wrong: ["הִיא קָרְאָה הַסֵּפֶר", "הִיא קָרָא אֶת הַסֵּפֶר", "הִיא קוֹרֵאת אֶת הַסֵּפֶר"] },
      { english: "we saw the movie", hint: "לִרְאוֹת", hebrew: "רָאִינוּ אֶת הַסֶּרֶט", wrong: ["רָאִינוּ הַסֶּרֶט", "רָאִיתִי אֶת הַסֶּרֶט", "רָאִינוּ אֶת סֶרֶט"] },
      { english: "he opened the window", hint: "לִפְתֹּחַ", hebrew: "הוּא פָּתַח אֶת הַחַלּוֹן", wrong: ["הוּא פָּתַח הַחַלּוֹן", "הוּא פָּתְחָה אֶת הַחַלּוֹן", "הוּא פּוֹתֵחַ אֶת הַחַלּוֹן"] },
      { english: "they ate the cake", hint: "לֶאֱכֹל", hebrew: "הֵם אָכְלוּ אֶת הָעוּגָה", wrong: ["הֵם אָכְלוּ הָעוּגָה", "הֵם אָכַל אֶת הָעוּגָה", "הֵם אָכְלוּ אֶת עוּגָה"] },
      { english: "I heard the song", hint: "לִשְׁמֹעַ", hebrew: "שָׁמַעְתִּי אֶת הַשִּׁיר", wrong: ["שָׁמַעְתִּי הַשִּׁיר", "שָׁמַעְנוּ אֶת הַשִּׁיר", "אֲנִי שׁוֹמֵעַ אֶת הַשִּׁיר"] },
      { english: "you (m.) bought the car", hint: "לִקְנוֹת", hebrew: "קָנִיתָ אֶת הַמְּכוֹנִית", wrong: ["קָנִיתָ הַמְּכוֹנִית", "קָנִית אֶת הַמְּכוֹנִית", "קָנִיתָ אֶת מְכוֹנִית"] },
      { english: "she met David", hint: "לִפְגֹּשׁ", hebrew: "הִיא פָּגְשָׁה אֶת דָּוִד", wrong: ["הִיא פָּגְשָׁה דָּוִד", "הִיא פָּגַשׁ אֶת דָּוִד", "הִיא פּוֹגֶשֶׁת אֶת דָּוִד"] },
      { english: "we did the homework", hint: "לַעֲשׂוֹת", hebrew: "עָשִׂינוּ אֶת שִׁעוּרֵי הַבַּיִת", wrong: ["עָשִׂינוּ שִׁעוּרֵי הַבַּיִת", "עָשִׂיתִי אֶת שִׁעוּרֵי הַבַּיִת", "עוֹשִׂים אֶת שִׁעוּרֵי הַבַּיִת"] },
      { english: "he saw a dog", hint: "לִרְאוֹת", hebrew: "הוּא רָאָה כֶּלֶב", wrong: ["הוּא רָאָה אֶת כֶּלֶב", "הוּא רָאָה הַכֶּלֶב", "הוּא רָאֲתָה כֶּלֶב"] },
    ],
  },
  {
    id: "level-13", english: "Future tense", hebrew: "עָתִיד",
    words: [
      { english: "he will eat", hint: "לֶאֱכֹל", hebrew: "הוּא יֹאכַל", wrong: ["הוּא אָכַל", "הוּא תֹּאכַל", "הוּא אוֹכֵל"] },
      { english: "she will eat", hint: "לֶאֱכֹל", hebrew: "הִיא תֹּאכַל", wrong: ["הִיא יֹאכַל", "הִיא אָכְלָה", "הִיא תֹּאכְלִי"] },
      { english: "I will write", hint: "לִכְתֹּב", hebrew: "אֶכְתֹּב", wrong: ["נִכְתֹּב", "כָּתַבְתִּי", "יִכְתֹּב"] },
      { english: "we will go", hint: "לָלֶכֶת", hebrew: "נֵלֵךְ", wrong: ["אֵלֵךְ", "הָלַכְנוּ", "יֵלְכוּ"] },
      { english: "they will work", hint: "לַעֲבֹד", hebrew: "הֵם יַעַבְדוּ", wrong: ["הֵם עָבְדוּ", "הֵם יַעֲבֹד", "הֵם עוֹבְדִים"] },
      { english: "you (m.) will speak", hint: "לְדַבֵּר", hebrew: "אַתָּה תְּדַבֵּר", wrong: ["אַתְּ תְּדַבְּרִי", "אַתָּה דִּבַּרְתָּ", "אַתָּה יְדַבֵּר"] },
      { english: "you (f.) will read", hint: "לִקְרֹא", hebrew: "אַתְּ תִּקְרְאִי", wrong: ["אַתָּה תִּקְרָא", "אַתְּ קָרָאת", "אַתְּ תִּקְרָא"] },
      { english: "tomorrow I will buy bread", hint: "לִקְנוֹת", hebrew: "מָחָר אֶקְנֶה לֶחֶם", wrong: ["מָחָר קָנִיתִי לֶחֶם", "מָחָר נִקְנֶה לֶחֶם", "מָחָר אֲנִי לִקְנוֹת לֶחֶם"] },
      { english: "tomorrow it will rain", hint: "לָרֶדֶת", hebrew: "מָחָר יֵרֵד גֶּשֶׁם", wrong: ["מָחָר יָרַד גֶּשֶׁם", "מָחָר תֵּרֵד גֶּשֶׁם", "מָחָר יוֹרֵד גֶּשֶׁם"] },
      { english: "we will live in Israel", hint: "לָגוּר", hebrew: "נָגוּר בְּיִשְׂרָאֵל", wrong: ["גַּרְנוּ בְּיִשְׂרָאֵל", "אָגוּר בְּיִשְׂרָאֵל", "נָגוּר לְיִשְׂרָאֵל"] },
      { english: "he will sleep", hint: "לִישֹׁן", hebrew: "הוּא יִישַׁן", wrong: ["הוּא יָשַׁן", "הוּא תִּישַׁן", "הוּא יָשֵׁן"] },
    ],
  },
  {
    id: "level-14", english: "Future tense with אֶת", hebrew: "עָתִיד עִם אֶת",
    words: [
      { english: "she will read the book", hint: "לִקְרֹא", hebrew: "הִיא תִּקְרָא אֶת הַסֵּפֶר", wrong: ["הִיא תִּקְרָא הַסֵּפֶר", "הִיא יִקְרָא אֶת הַסֵּפֶר", "הִיא קָרְאָה אֶת הַסֵּפֶר"] },
      { english: "I will write the letter", hint: "לִכְתֹּב", hebrew: "אֶכְתֹּב אֶת הַמִּכְתָּב", wrong: ["אֶכְתֹּב הַמִּכְתָּב", "אֶכְתֹּב אֶת מִכְתָּב", "כָּתַבְתִּי אֶת הַמִּכְתָּב"] },
      { english: "we will see the movie", hint: "לִרְאוֹת", hebrew: "נִרְאֶה אֶת הַסֶּרֶט", wrong: ["נִרְאֶה הַסֶּרֶט", "רָאִינוּ אֶת הַסֶּרֶט", "אֶרְאֶה אֶת הַסֶּרֶט"] },
      { english: "he will open the door", hint: "לִפְתֹּחַ", hebrew: "הוּא יִפְתַּח אֶת הַדֶּלֶת", wrong: ["הוּא יִפְתַּח הַדֶּלֶת", "הוּא פָּתַח אֶת הַדֶּלֶת", "הוּא תִּפְתַּח אֶת הַדֶּלֶת"] },
      { english: "they will eat the cake", hint: "לֶאֱכֹל", hebrew: "הֵם יֹאכְלוּ אֶת הָעוּגָה", wrong: ["הֵם יֹאכְלוּ הָעוּגָה", "הֵם אָכְלוּ אֶת הָעוּגָה", "הֵם יֹאכַל אֶת הָעוּגָה"] },
      { english: "you (m.) will buy the car", hint: "לִקְנוֹת", hebrew: "אַתָּה תִּקְנֶה אֶת הַמְּכוֹנִית", wrong: ["אַתָּה תִּקְנֶה הַמְּכוֹנִית", "אַתָּה קָנִיתָ אֶת הַמְּכוֹנִית", "אַתָּה יִקְנֶה אֶת הַמְּכוֹנִית"] },
      { english: "I will meet David", hint: "לִפְגֹּשׁ", hebrew: "אֶפְגֹּשׁ אֶת דָּוִד", wrong: ["אֶפְגֹּשׁ דָּוִד", "פָּגַשְׁתִּי אֶת דָּוִד", "נִפְגֹּשׁ אֶת דָּוִד"] },
      { english: "we will do the homework", hint: "לַעֲשׂוֹת", hebrew: "נַעֲשֶׂה אֶת שִׁעוּרֵי הַבַּיִת", wrong: ["נַעֲשֶׂה שִׁעוּרֵי הַבַּיִת", "עָשִׂינוּ אֶת שִׁעוּרֵי הַבַּיִת", "אֶעֱשֶׂה אֶת שִׁעוּרֵי הַבַּיִת"] },
      { english: "she will hear the song", hint: "לִשְׁמֹעַ", hebrew: "הִיא תִּשְׁמַע אֶת הַשִּׁיר", wrong: ["הִיא תִּשְׁמַע הַשִּׁיר", "הִיא שָׁמְעָה אֶת הַשִּׁיר", "הִיא יִשְׁמַע אֶת הַשִּׁיר"] },
    ],
  },
  {
    id: "level-15", english: "Passive: was built, was written", hebrew: "סָבִיל",
    words: [
      { english: "was built", hint: "לִבְנוֹת", hebrew: "נִבְנָה", wrong: ["בָּנָה", "יִבָּנֶה", "נִבְנְתָה"] },
      { english: "was written", hint: "לִכְתֹּב", hebrew: "נִכְתַּב", wrong: ["כָּתַב", "יִכָּתֵב", "נִכְתְּבָה"] },
      { english: "the house was built in 1990", hint: "לִבְנוֹת", hebrew: "הַבַּיִת נִבְנָה בְּ־1990", wrong: ["הַבַּיִת בָּנָה בְּ־1990", "הַבַּיִת נִבְנְתָה בְּ־1990", "הַבַּיִת יִבָּנֶה בְּ־1990"] },
      { english: "the book was written by David", hint: "לִכְתֹּב", hebrew: "הַסֵּפֶר נִכְתַּב עַל יְדֵי דָּוִד", wrong: ["הַסֵּפֶר כָּתַב עַל יְדֵי דָּוִד", "הַסֵּפֶר נִכְתַּב לְדָוִד", "הַסֵּפֶר נִכְתְּבָה עַל יְדֵי דָּוִד"] },
      { english: "the door was opened", hint: "לִפְתֹּחַ", hebrew: "הַדֶּלֶת נִפְתְּחָה", wrong: ["הַדֶּלֶת נִפְתַּח", "הַדֶּלֶת פָּתְחָה", "הַדֶּלֶת תִּפָּתַח"] },
      { english: "the letter was sent", hint: "לִשְׁלֹחַ", hebrew: "הַמִּכְתָּב נִשְׁלַח", wrong: ["הַמִּכְתָּב שָׁלַח", "הַמִּכְתָּב נִשְׁלְחָה", "הַמִּכְתָּב יִשָּׁלַח"] },
      { english: "the cake was eaten", hint: "לֶאֱכֹל", hebrew: "הָעוּגָה נֶאֶכְלָה", wrong: ["הָעוּגָה אָכְלָה", "הָעוּגָה נֶאֱכַל", "הָעוּגָה תֵּאָכֵל"] },
      { english: "the city was built by the king", hint: "לִבְנוֹת", hebrew: "הָעִיר נִבְנְתָה עַל יְדֵי הַמֶּלֶךְ", wrong: ["הָעִיר נִבְנָה עַל יְדֵי הַמֶּלֶךְ", "הָעִיר בָּנְתָה עַל יְדֵי הַמֶּלֶךְ", "הָעִיר נִבְנְתָה לַמֶּלֶךְ"] },
      { english: "the window was closed", hint: "לִסְגֹּר", hebrew: "הַחַלּוֹן נִסְגַּר", wrong: ["הַחַלּוֹן סָגַר", "הַחַלּוֹן נִסְגְּרָה", "הַחַלּוֹן יִסָּגֵר"] },
      { english: "the songs were written", hint: "לִכְתֹּב", hebrew: "הַשִּׁירִים נִכְתְּבוּ", wrong: ["הַשִּׁירִים נִכְתַּב", "הַשִּׁירִים כָּתְבוּ", "הַשִּׁירִים יִכָּתְבוּ"] },
    ],
  },
];

// ---------- The deck being played right now ----------

// WORDS = the words of the deck being played. quiz.js and progress.js ask questions from it.
let WORDS = LEVELS[0].words;
let currentDeckId = LEVELS[0].id;

// Find a deck by its id (like "level-3"). Returns undefined if there's no such deck.
function findDeck(deckId) {
  return LEVELS.find((deck) => deck.id === deckId);
}

// Switch to another deck (the host picked one in the lobby).
function useDeck(deckId) {
  const deck = findDeck(deckId);
  if (!deck) return;
  currentDeckId = deck.id;
  WORDS = deck.words;
}

// The name shown in the lobby, like "3 · Prefixes: the (הַ) and (וְ)".
function deckLabel(deck) {
  return `${LEVELS.indexOf(deck) + 1} · ${deck.english}`;
}
