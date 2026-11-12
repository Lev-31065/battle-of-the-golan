// words.js — the built-in word decks ("levels"). Every question in the game comes from here
// (or, later, from a teacher's own deck).
//
// Each level is a deck: a name in English and Hebrew, plus a list of words or sentences.
// The host picks the deck in the lobby: Auto (each player gets their own level),
// or one level that everyone in the room plays.
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
//   f:     the FEMININE version of an "I" or "we" sentence. The line itself is the
//          masculine version. Each player picks masculine or feminine on the first
//          screen, and gets that version. For example:
//     { english: "I am happy", hebrew: "אֲנִי שָׂמֵחַ", wrong: [...],
//       f: { hebrew: "אֲנִי שְׂמֵחָה", wrong: [...] } },
//
// English "you" and "they" say (m.) or (f.) when the Hebrew depends on it.
// "I" and "we" don't, because they follow the player's own choice.
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
      { english: "I am happy", hebrew: "אֲנִי שָׂמֵחַ", wrong: ["אֲנִי שְׂמֵחָה", "הוּא שָׂמֵחַ", "אֲנִי עָצוּב"],
        f: { hebrew: "אֲנִי שְׂמֵחָה", wrong: ["אֲנִי שָׂמֵחַ", "הִיא שְׂמֵחָה", "אֲנִי עֲצוּבָה"] } },
      { english: "she is sad", hebrew: "הִיא עֲצוּבָה", wrong: ["הִיא עָצוּב", "הוּא עָצוּב", "הִיא שְׂמֵחָה"] },
      { english: "he is tired", hebrew: "הוּא עָיֵף", wrong: ["הוּא עֲיֵפָה", "הִיא עֲיֵפָה", "הוּא שָׂמֵחַ"] },
      { english: "they (m.) are green", hebrew: "הֵם יְרֻקִּים", wrong: ["הֵם יָרֹק", "הֵן יְרֻקּוֹת", "הֵם כְּחֻלִּים"] },
      { english: "the box is empty", hebrew: "הַקֻּפְסָה רֵיקָה", wrong: ["הַקֻּפְסָה רֵיק", "הַקֻּפְסָה הָרֵיקָה", "הַקֻּפְסָה מְלֵאָה"] },
      { english: "the house is big", hebrew: "הַבַּיִת גָּדוֹל", wrong: ["הַבַּיִת הַגָּדוֹל", "הַבַּיִת גְּדוֹלָה", "הַבַּיִת קָטָן"] },
      { english: "the coffee is hot", hebrew: "הַקָּפֶה חַם", wrong: ["הַקָּפֶה הַחַם", "הַקָּפֶה חַמָּה", "הַקָּפֶה קַר"] },
      { english: "the water is cold", hebrew: "הַמַּיִם קָרִים", wrong: ["הַמַּיִם קַר", "הַמַּיִם הַקָּרִים", "הַמַּיִם חַמִּים"] },
      { english: "we are students", hebrew: "אֲנַחְנוּ תַּלְמִידִים", wrong: ["אֲנַחְנוּ תַּלְמִיד", "הֵם תַּלְמִידִים", "אֲנַחְנוּ מוֹרִים"],
        f: { hebrew: "אֲנַחְנוּ תַּלְמִידוֹת", wrong: ["אֲנַחְנוּ תַּלְמִידָה", "הֵן תַּלְמִידוֹת", "אֲנַחְנוּ מוֹרוֹת"] } },
      { english: "you (m.) are tall", hebrew: "אַתָּה גָּבוֹהַּ", wrong: ["אַתְּ גְּבוֹהָה", "אַתָּה נָמוּךְ", "הוּא גָּבוֹהַּ"] },
      { english: "you (f.) are smart", hebrew: "אַתְּ חֲכָמָה", wrong: ["אַתָּה חָכָם", "אַתְּ חָכָם", "הִיא חֲכָמָה"] },
      { english: "the girls are happy", hebrew: "הַיְלָדוֹת שְׂמֵחוֹת", wrong: ["הַיְלָדוֹת שְׂמֵחִים", "הַיְלָדִים שְׂמֵחִים", "הַיְלָדוֹת עֲצוּבוֹת"] },
      { english: "the food is good", hebrew: "הָאֹכֶל טוֹב", wrong: ["הָאֹכֶל טוֹבָה", "הָאֹכֶל הַטּוֹב", "הָאֹכֶל רַע"] },
      { english: "they (f.) are tired", hebrew: "הֵן עֲיֵפוֹת", wrong: ["הֵן עֲיֵפִים", "הֵם עֲיֵפִים", "הֵן עֲיֵפָה"] },
      { english: "you all (m.) are ready", hebrew: "אַתֶּם מוּכָנִים", wrong: ["אַתֶּן מוּכָנוֹת", "אַתֶּם מוּכָן", "אַתָּה מוּכָן"] },
      { english: "you all (f.) are hungry", hebrew: "אַתֶּן רְעֵבוֹת", wrong: ["אַתֶּם רְעֵבִים", "אַתֶּן רְעֵבִים", "אַתְּ רְעֵבָה"] },
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
      { english: "I want to sleep", hebrew: "אֲנִי רוֹצֶה לִישֹׁן", wrong: ["אֲנִי רוֹצָה לִישֹׁן", "אֲנִי רוֹצֶה יָשֵׁן", "אֲנִי אוֹהֵב לִישֹׁן"],
        f: { hebrew: "אֲנִי רוֹצָה לִישֹׁן", wrong: ["אֲנִי רוֹצֶה לִישֹׁן", "אֲנִי רוֹצָה יְשֵׁנָה", "אֲנִי אוֹהֶבֶת לִישֹׁן"] } },
      { english: "I like to read", hebrew: "אֲנִי אוֹהֵב לִקְרֹא", wrong: ["אֲנִי אוֹהֶבֶת לִקְרֹא", "אֲנִי רוֹצֶה לִקְרֹא", "אֲנִי אוֹהֵב קוֹרֵא"],
        f: { hebrew: "אֲנִי אוֹהֶבֶת לִקְרֹא", wrong: ["אֲנִי אוֹהֵב לִקְרֹא", "אֲנִי רוֹצָה לִקְרֹא", "אֲנִי אוֹהֶבֶת קוֹרֵאת"] } },
      { english: "we want to play", hebrew: "אֲנַחְנוּ רוֹצִים לְשַׂחֵק", wrong: ["אֲנַחְנוּ רוֹצֶה לְשַׂחֵק", "אֲנַחְנוּ אוֹהֲבִים לְשַׂחֵק", "אֲנַחְנוּ רוֹצִים מְשַׂחֲקִים"],
        f: { hebrew: "אֲנַחְנוּ רוֹצוֹת לְשַׂחֵק", wrong: ["אֲנַחְנוּ רוֹצָה לְשַׂחֵק", "אֲנַחְנוּ אוֹהֲבוֹת לְשַׂחֵק", "אֲנַחְנוּ רוֹצוֹת מְשַׂחֲקוֹת"] } },
      { english: "you (m.) want to drink", hebrew: "אַתָּה רוֹצֶה לִשְׁתּוֹת", wrong: ["אַתְּ רוֹצָה לִשְׁתּוֹת", "אַתָּה רוֹצֶה לֶאֱכֹל", "אַתָּה רוֹצֶה שׁוֹתֶה"] },
      { english: "you (f.) like to write", hebrew: "אַתְּ אוֹהֶבֶת לִכְתֹּב", wrong: ["אַתָּה אוֹהֵב לִכְתֹּב", "אַתְּ אוֹהֵב לִכְתֹּב", "אַתְּ אוֹהֶבֶת לִקְרֹא"] },
      { english: "the children want to go", hebrew: "הַיְלָדִים רוֹצִים לָלֶכֶת", wrong: ["הַיְלָדִים רוֹצֶה לָלֶכֶת", "הַיְלָדִים רוֹצִים הוֹלְכִים", "הַיְלָדוֹת רוֹצוֹת לָלֶכֶת"] },
      { english: "she likes to speak Hebrew", hebrew: "הִיא אוֹהֶבֶת לְדַבֵּר עִבְרִית", wrong: ["הִיא אוֹהֵב לְדַבֵּר עִבְרִית", "הִיא אוֹהֶבֶת מְדַבֶּרֶת עִבְרִית", "הוּא אוֹהֵב לְדַבֵּר עִבְרִית"] },
      { english: "he doesn't want to work", hebrew: "הוּא לֹא רוֹצֶה לַעֲבֹד", wrong: ["לֹא הוּא רוֹצֶה לַעֲבֹד", "הוּא לֹא רוֹצָה לַעֲבֹד", "הוּא לֹא רוֹצֶה עוֹבֵד"] },
      { english: "they (f.) want to dance", hebrew: "הֵן רוֹצוֹת לִרְקֹד", wrong: ["הֵן רוֹצִים לִרְקֹד", "הֵם רוֹצִים לִרְקֹד", "הֵן רוֹצוֹת רוֹקְדוֹת"] },
      { english: "you all (m.) like to play soccer", hebrew: "אַתֶּם אוֹהֲבִים לְשַׂחֵק כַּדּוּרֶגֶל", wrong: ["אַתֶּן אוֹהֲבוֹת לְשַׂחֵק כַּדּוּרֶגֶל", "אַתֶּם אוֹהֵב לְשַׂחֵק כַּדּוּרֶגֶל", "אַתֶּם אוֹהֲבִים מְשַׂחֲקִים כַּדּוּרֶגֶל"] },
      { english: "you all (f.) want to eat", hebrew: "אַתֶּן רוֹצוֹת לֶאֱכֹל", wrong: ["אַתֶּם רוֹצִים לֶאֱכֹל", "אַתֶּן רוֹצָה לֶאֱכֹל", "אַתֶּן רוֹצוֹת אוֹכְלוֹת"] },
      { english: "we like to live in Israel", hebrew: "אֲנַחְנוּ אוֹהֲבִים לִחְיוֹת בְּיִשְׂרָאֵל", wrong: ["אֲנַחְנוּ אוֹהֲבִים לִחְיוֹת לְיִשְׂרָאֵל", "אֲנַחְנוּ אוֹהֵב לִחְיוֹת בְּיִשְׂרָאֵל", "אֲנַחְנוּ אוֹהֲבִים חַיִּים בְּיִשְׂרָאֵל"],
        f: { hebrew: "אֲנַחְנוּ אוֹהֲבוֹת לִחְיוֹת בְּיִשְׂרָאֵל", wrong: ["אֲנַחְנוּ אוֹהֲבוֹת לִחְיוֹת לְיִשְׂרָאֵל", "אֲנַחְנוּ אוֹהֶבֶת לִחְיוֹת בְּיִשְׂרָאֵל", "אֲנַחְנוּ אוֹהֲבוֹת חַיִּים בְּיִשְׂרָאֵל"] } },
    ],
  },
  {
    id: "level-8", english: "Present tense", hebrew: "הוֹוֶה",
    words: [
      { english: "he eats", hint: "לֶאֱכֹל", hebrew: "הוּא אוֹכֵל", wrong: ["הוּא אוֹכֶלֶת", "הֵם אוֹכְלִים", "הוּא לֶאֱכֹל"] },
      { english: "she eats", hint: "לֶאֱכֹל", hebrew: "הִיא אוֹכֶלֶת", wrong: ["הִיא אוֹכֵל", "הִיא אוֹכְלוֹת", "הוּא אוֹכֵל"] },
      { english: "they (m.) eat", hint: "לֶאֱכֹל", hebrew: "הֵם אוֹכְלִים", wrong: ["הֵם אוֹכֵל", "הֵן אוֹכְלוֹת", "הֵם אוֹכְלוֹת"] },
      { english: "I write", hint: "לִכְתֹּב", hebrew: "אֲנִי כּוֹתֵב", wrong: ["אֲנִי כּוֹתֶבֶת", "אֲנִי לִכְתֹּב", "אֲנִי כָּתַבְתִּי"],
        f: { hebrew: "אֲנִי כּוֹתֶבֶת", wrong: ["אֲנִי כּוֹתֵב", "אֲנִי לִכְתֹּב", "אֲנִי כּוֹתְבוֹת"] } },
      { english: "she writes", hint: "לִכְתֹּב", hebrew: "הִיא כּוֹתֶבֶת", wrong: ["הִיא כּוֹתֵב", "הִיא כּוֹתְבוֹת", "הִיא לִכְתֹּב"] },
      { english: "we work", hint: "לַעֲבֹד", hebrew: "אֲנַחְנוּ עוֹבְדִים", wrong: ["אֲנַחְנוּ עוֹבֵד", "אֲנַחְנוּ לַעֲבֹד", "הֵם עוֹבְדִים"],
        f: { hebrew: "אֲנַחְנוּ עוֹבְדוֹת", wrong: ["אֲנַחְנוּ עוֹבֶדֶת", "אֲנַחְנוּ לַעֲבֹד", "הֵן עוֹבְדוֹת"] } },
      { english: "you (f.) speak", hint: "לְדַבֵּר", hebrew: "אַתְּ מְדַבֶּרֶת", wrong: ["אַתְּ מְדַבֵּר", "אַתָּה מְדַבֵּר", "אַתְּ לְדַבֵּר"] },
      { english: "he lives in Haifa", hint: "לָגוּר", hebrew: "הוּא גָּר בְּחֵיפָה", wrong: ["הוּא גָּרָה בְּחֵיפָה", "הוּא גָּר לְחֵיפָה", "הוּא לָגוּר בְּחֵיפָה"] },
      { english: "she goes to school", hint: "לָלֶכֶת", hebrew: "הִיא הוֹלֶכֶת לְבֵית הַסֵּפֶר", wrong: ["הִיא הוֹלֵךְ לְבֵית הַסֵּפֶר", "הִיא הוֹלֶכֶת בְּבֵית הַסֵּפֶר", "הִיא לָלֶכֶת לְבֵית הַסֵּפֶר"] },
      { english: "the girls read", hint: "לִקְרֹא", hebrew: "הַיְלָדוֹת קוֹרְאוֹת", wrong: ["הַיְלָדוֹת קוֹרְאִים", "הַיְלָדוֹת קוֹרֵאת", "הַיְלָדִים קוֹרְאִים"] },
      { english: "I drink coffee", hint: "לִשְׁתּוֹת", hebrew: "אֲנִי שׁוֹתֶה קָפֶה", wrong: ["אֲנִי שׁוֹתָה קָפֶה", "אֲנִי לִשְׁתּוֹת קָפֶה", "אֲנִי שׁוֹתֶה הַקָּפֶה"],
        f: { hebrew: "אֲנִי שׁוֹתָה קָפֶה", wrong: ["אֲנִי שׁוֹתֶה קָפֶה", "אֲנִי לִשְׁתּוֹת קָפֶה", "אֲנִי שׁוֹתָה הַקָּפֶה"] } },
      { english: "they (m.) play in the park", hint: "לְשַׂחֵק", hebrew: "הֵם מְשַׂחֲקִים בַּפַּארְק", wrong: ["הֵם מְשַׂחֵק בַּפַּארְק", "הֵם מְשַׂחֲקִים לַפַּארְק", "הֵן מְשַׂחֲקוֹת בַּפַּארְק"] },
      { english: "he sleeps at night", hint: "לִישֹׁן", hebrew: "הוּא יָשֵׁן בַּלַּיְלָה", wrong: ["הוּא יְשֵׁנָה בַּלַּיְלָה", "הוּא לִישֹׁן בַּלַּיְלָה", "הוּא יָשֵׁן לַלַּיְלָה"] },
      { english: "you (m.) read", hint: "לִקְרֹא", hebrew: "אַתָּה קוֹרֵא", wrong: ["אַתְּ קוֹרֵאת", "אַתָּה קוֹרֵאת", "אַתָּה לִקְרֹא"] },
      { english: "they (f.) work", hint: "לַעֲבֹד", hebrew: "הֵן עוֹבְדוֹת", wrong: ["הֵן עוֹבְדִים", "הֵם עוֹבְדִים", "הֵן עוֹבֶדֶת"] },
      { english: "you all (m.) speak Hebrew", hint: "לְדַבֵּר", hebrew: "אַתֶּם מְדַבְּרִים עִבְרִית", wrong: ["אַתֶּן מְדַבְּרוֹת עִבְרִית", "אַתֶּם מְדַבֵּר עִבְרִית", "אַתֶּם לְדַבֵּר עִבְרִית"] },
      { english: "you all (f.) live in Tel Aviv", hint: "לָגוּר", hebrew: "אַתֶּן גָּרוֹת בְּתֵל אָבִיב", wrong: ["אַתֶּם גָּרִים בְּתֵל אָבִיב", "אַתֶּן גָּרוֹת לְתֵל אָבִיב", "אַתֶּן גָּרָה בְּתֵל אָבִיב"] },
      { english: "we learn Hebrew", hint: "לִלְמֹד", hebrew: "אֲנַחְנוּ לוֹמְדִים עִבְרִית", wrong: ["אֲנַחְנוּ לוֹמֵד עִבְרִית", "אֲנַחְנוּ לִלְמֹד עִבְרִית", "הֵם לוֹמְדִים עִבְרִית"],
        f: { hebrew: "אֲנַחְנוּ לוֹמְדוֹת עִבְרִית", wrong: ["אֲנַחְנוּ לוֹמֶדֶת עִבְרִית", "אֲנַחְנוּ לִלְמֹד עִבְרִית", "הֵן לוֹמְדוֹת עִבְרִית"] } },
    ],
  },
  {
    id: "level-9", english: "Prefixes: that (שֶׁ) and when (כְּשֶׁ)", hebrew: "שֶׁ־ כְּשֶׁ־",
    words: [
      { english: "the boy who eats", hebrew: "הַיֶּלֶד שֶׁאוֹכֵל", wrong: ["הַיֶּלֶד אוֹכֵל", "יֶלֶד שֶׁאוֹכֵל", "הַיֶּלֶד שֶׁאוֹכֶלֶת"] },
      { english: "the girl who reads", hebrew: "הַיַּלְדָּה שֶׁקּוֹרֵאת", wrong: ["הַיַּלְדָּה קוֹרֵאת", "הַיַּלְדָּה שֶׁקּוֹרֵא", "הַיַּלְדָּה כְּשֶׁקּוֹרֵאת"] },
      { english: "the book that I am reading", hebrew: "הַסֵּפֶר שֶׁאֲנִי קוֹרֵא", wrong: ["הַסֵּפֶר אֲנִי קוֹרֵא", "הַסֵּפֶר שֶׁאֲנִי קוֹרֵאת", "סֵפֶר שֶׁאֲנִי קוֹרֵא"],
        f: { hebrew: "הַסֵּפֶר שֶׁאֲנִי קוֹרֵאת", wrong: ["הַסֵּפֶר אֲנִי קוֹרֵאת", "הַסֵּפֶר שֶׁאֲנִי קוֹרֵא", "סֵפֶר שֶׁאֲנִי קוֹרֵאת"] } },
      { english: "the man who works here", hebrew: "הָאִישׁ שֶׁעוֹבֵד כָּאן", wrong: ["הָאִישׁ עוֹבֵד כָּאן", "הָאִישׁ שֶׁעוֹבֶדֶת כָּאן", "הָאִישׁ כְּשֶׁעוֹבֵד כָּאן"] },
      { english: "I know that he is here", hebrew: "אֲנִי יוֹדֵעַ שֶׁהוּא כָּאן", wrong: ["אֲנִי יוֹדֵעַ הוּא כָּאן", "אֲנִי יוֹדַעַת שֶׁהוּא כָּאן", "אֲנִי יוֹדֵעַ כְּשֶׁהוּא כָּאן"],
        f: { hebrew: "אֲנִי יוֹדַעַת שֶׁהוּא כָּאן", wrong: ["אֲנִי יוֹדַעַת הוּא כָּאן", "אֲנִי יוֹדֵעַ שֶׁהוּא כָּאן", "אֲנִי יוֹדַעַת כְּשֶׁהוּא כָּאן"] } },
      { english: "she says that it's cold", hebrew: "הִיא אוֹמֶרֶת שֶׁקַּר", wrong: ["הִיא אוֹמֶרֶת קַר", "הִיא אוֹמֵר שֶׁקַּר", "הִיא אוֹמֶרֶת כְּשֶׁקַּר"] },
      { english: "when I eat", hebrew: "כְּשֶׁאֲנִי אוֹכֵל", wrong: ["שֶׁאֲנִי אוֹכֵל", "כְּשֶׁאֲנִי אוֹכֶלֶת", "כְּאֲנִי אוֹכֵל"],
        f: { hebrew: "כְּשֶׁאֲנִי אוֹכֶלֶת", wrong: ["שֶׁאֲנִי אוֹכֶלֶת", "כְּשֶׁאֲנִי אוֹכֵל", "כְּאֲנִי אוֹכֶלֶת"] } },
      { english: "when it rains", hebrew: "כְּשֶׁיּוֹרֵד גֶּשֶׁם", wrong: ["שֶׁיּוֹרֵד גֶּשֶׁם", "כְּשֶׁיּוֹרֶדֶת גֶּשֶׁם", "יוֹרֵד גֶּשֶׁם"] },
      { english: "like a dog", hebrew: "כְּמוֹ כֶּלֶב", wrong: ["כְּשֶׁכֶּלֶב", "שֶׁכֶּלֶב", "כֶּלֶב כְּמוֹ"] },
      { english: "the city where we live", hebrew: "הָעִיר שֶׁאֲנַחְנוּ גָּרִים בָּהּ", wrong: ["הָעִיר אֲנַחְנוּ גָּרִים", "הָעִיר שֶׁאֲנַחְנוּ גָּרִים לָהּ", "הָעִיר כְּשֶׁאֲנַחְנוּ גָּרִים בָּהּ"],
        f: { hebrew: "הָעִיר שֶׁאֲנַחְנוּ גָּרוֹת בָּהּ", wrong: ["הָעִיר אֲנַחְנוּ גָּרוֹת", "הָעִיר שֶׁאֲנַחְנוּ גָּרוֹת לָהּ", "הָעִיר כְּשֶׁאֲנַחְנוּ גָּרוֹת בָּהּ"] } },
    ],
  },
  {
    id: "level-10", english: "Present tense with אֶת", hebrew: "הוֹוֶה עִם אֶת",
    words: [
      { english: "I see the dog", hint: "לִרְאוֹת", hebrew: "אֲנִי רוֹאֶה אֶת הַכֶּלֶב", wrong: ["אֲנִי רוֹאֶה הַכֶּלֶב", "אֲנִי רוֹאֶה אֶת כֶּלֶב", "אֲנִי רוֹאָה אֶת הַכֶּלֶב"],
        f: { hebrew: "אֲנִי רוֹאָה אֶת הַכֶּלֶב", wrong: ["אֲנִי רוֹאָה הַכֶּלֶב", "אֲנִי רוֹאָה אֶת כֶּלֶב", "אֲנִי רוֹאֶה אֶת הַכֶּלֶב"] } },
      { english: "I see a dog", hint: "לִרְאוֹת", hebrew: "אֲנִי רוֹאֶה כֶּלֶב", wrong: ["אֲנִי רוֹאֶה אֶת כֶּלֶב", "אֲנִי רוֹאֶה אֶת הַכֶּלֶב", "אֲנִי רוֹאָה כֶּלֶב"],
        f: { hebrew: "אֲנִי רוֹאָה כֶּלֶב", wrong: ["אֲנִי רוֹאָה אֶת כֶּלֶב", "אֲנִי רוֹאָה אֶת הַכֶּלֶב", "אֲנִי רוֹאֶה כֶּלֶב"] } },
      { english: "she reads the book", hint: "לִקְרֹא", hebrew: "הִיא קוֹרֵאת אֶת הַסֵּפֶר", wrong: ["הִיא קוֹרֵאת הַסֵּפֶר", "הִיא קוֹרֵאת אֶת סֵפֶר", "הִיא קוֹרֵא אֶת הַסֵּפֶר"] },
      { english: "he loves Dana", hint: "לֶאֱהֹב", hebrew: "הוּא אוֹהֵב אֶת דָּנָה", wrong: ["הוּא אוֹהֵב דָּנָה", "הוּא אוֹהֵב אֶת הַדָּנָה", "הִיא אוֹהֶבֶת אֶת דָּנָה"] },
      { english: "we eat the apple", hint: "לֶאֱכֹל", hebrew: "אֲנַחְנוּ אוֹכְלִים אֶת הַתַּפּוּחַ", wrong: ["אֲנַחְנוּ אוֹכְלִים הַתַּפּוּחַ", "אֲנַחְנוּ אוֹכְלִים אֶת תַּפּוּחַ", "אֲנַחְנוּ אוֹכֵל אֶת הַתַּפּוּחַ"],
        f: { hebrew: "אֲנַחְנוּ אוֹכְלוֹת אֶת הַתַּפּוּחַ", wrong: ["אֲנַחְנוּ אוֹכְלוֹת הַתַּפּוּחַ", "אֲנַחְנוּ אוֹכְלוֹת אֶת תַּפּוּחַ", "אֲנַחְנוּ אוֹכֶלֶת אֶת הַתַּפּוּחַ"] } },
      { english: "they (m.) buy bread", hint: "לִקְנוֹת", hebrew: "הֵם קוֹנִים לֶחֶם", wrong: ["הֵם קוֹנִים אֶת לֶחֶם", "הֵם קוֹנֶה לֶחֶם", "הֵם קוֹנִים הַלֶּחֶם"] },
      { english: "they (m.) buy the bread", hint: "לִקְנוֹת", hebrew: "הֵם קוֹנִים אֶת הַלֶּחֶם", wrong: ["הֵם קוֹנִים הַלֶּחֶם", "הֵם קוֹנִים אֶת לֶחֶם", "הֵן קוֹנוֹת אֶת הַלֶּחֶם"] },
      { english: "you (f.) open the door", hint: "לִפְתֹּחַ", hebrew: "אַתְּ פּוֹתַחַת אֶת הַדֶּלֶת", wrong: ["אַתְּ פּוֹתַחַת הַדֶּלֶת", "אַתְּ פּוֹתֵחַ אֶת הַדֶּלֶת", "אַתְּ פּוֹתַחַת אֶת דֶּלֶת"] },
      { english: "I hear the music", hint: "לִשְׁמֹעַ", hebrew: "אֲנִי שׁוֹמֵעַ אֶת הַמּוּזִיקָה", wrong: ["אֲנִי שׁוֹמֵעַ הַמּוּזִיקָה", "אֲנִי שׁוֹמַעַת אֶת הַמּוּזִיקָה", "אֲנִי שׁוֹמֵעַ אֶת מוּזִיקָה"],
        f: { hebrew: "אֲנִי שׁוֹמַעַת אֶת הַמּוּזִיקָה", wrong: ["אֲנִי שׁוֹמַעַת הַמּוּזִיקָה", "אֲנִי שׁוֹמֵעַ אֶת הַמּוּזִיקָה", "אֲנִי שׁוֹמַעַת אֶת מוּזִיקָה"] } },
      { english: "the teacher (m.) writes the word", hint: "לִכְתֹּב", hebrew: "הַמּוֹרֶה כּוֹתֵב אֶת הַמִּלָּה", wrong: ["הַמּוֹרֶה כּוֹתֵב הַמִּלָּה", "הַמּוֹרֶה כּוֹתֵב אֶת מִלָּה", "הַמּוֹרֶה כּוֹתֶבֶת אֶת הַמִּלָּה"] },
      { english: "he knows the answer", hint: "לָדַעַת", hebrew: "הוּא יוֹדֵעַ אֶת הַתְּשׁוּבָה", wrong: ["הוּא יוֹדֵעַ הַתְּשׁוּבָה", "הוּא יוֹדֵעַ אֶת תְּשׁוּבָה", "הוּא יוֹדַעַת אֶת הַתְּשׁוּבָה"] },
      { english: "you all (f.) open the window", hint: "לִפְתֹּחַ", hebrew: "אַתֶּן פּוֹתְחוֹת אֶת הַחַלּוֹן", wrong: ["אַתֶּן פּוֹתְחוֹת הַחַלּוֹן", "אַתֶּם פּוֹתְחִים אֶת הַחַלּוֹן", "אַתֶּן פּוֹתְחוֹת אֶת חַלּוֹן"] },
    ],
  },
  {
    // Level 11: אֶת + a pronoun becomes ONE word: "he sees ME" = הוּא רוֹאֶה אוֹתִי (not "הוּא רוֹאֶה אֲנִי").
    // (Its id isn't "level-11": ids never change, so saved Auto levels and picks keep pointing
    //  at the same words. The level NUMBER shown to players comes from the order in this list.)
    id: "level-object-pronouns", english: "Object pronouns: me, him, her (אוֹתִי, אוֹתוֹ, אוֹתָהּ)", hebrew: "אֶת + כִּנּוּי: אוֹתִי, אוֹתוֹ, אוֹתָהּ",
    words: [
      { english: "me", hint: "אֶת + אֲנִי", hebrew: "אוֹתִי", wrong: ["אוֹתוֹ", "אוֹתָנוּ", "אֲנִי"] },
      { english: "you (m.)", hint: "אֶת + אַתָּה", hebrew: "אוֹתְךָ", wrong: ["אוֹתָךְ", "אַתָּה", "אֶתְכֶם"] },
      { english: "you (f.)", hint: "אֶת + אַתְּ", hebrew: "אוֹתָךְ", wrong: ["אוֹתְךָ", "אַתְּ", "אֶתְכֶן"] },
      { english: "him", hint: "אֶת + הוּא", hebrew: "אוֹתוֹ", wrong: ["אוֹתָהּ", "הוּא", "אוֹתָם"] },
      { english: "her", hint: "אֶת + הִיא", hebrew: "אוֹתָהּ", wrong: ["אוֹתוֹ", "הִיא", "אוֹתָן"] },
      { english: "us", hint: "אֶת + אֲנַחְנוּ", hebrew: "אוֹתָנוּ", wrong: ["אוֹתִי", "אֲנַחְנוּ", "אוֹתָם"] },
      { english: "you all (m.)", hint: "אֶת + אַתֶּם", hebrew: "אֶתְכֶם", wrong: ["אֶתְכֶן", "אַתֶּם", "אוֹתָם"] },
      { english: "you all (f.)", hint: "אֶת + אַתֶּן", hebrew: "אֶתְכֶן", wrong: ["אֶתְכֶם", "אַתֶּן", "אוֹתָן"] },
      { english: "them (m.)", hint: "אֶת + הֵם", hebrew: "אוֹתָם", wrong: ["אוֹתָן", "הֵם", "אוֹתוֹ"] },
      { english: "them (f.)", hint: "אֶת + הֵן", hebrew: "אוֹתָן", wrong: ["אוֹתָם", "הֵן", "אוֹתָהּ"] },
      { english: "he knows me", hint: "לְהַכִּיר", hebrew: "הוּא מַכִּיר אוֹתִי", wrong: ["הוּא מַכִּיר אֲנִי", "הוּא מַכִּיר אוֹתוֹ", "הוּא מַכִּירָה אוֹתִי"] },
      { english: "I see you (m.)", hint: "לִרְאוֹת", hebrew: "אֲנִי רוֹאֶה אוֹתְךָ", wrong: ["אֲנִי רוֹאֶה אַתָּה", "אֲנִי רוֹאֶה אוֹתָךְ", "אֲנִי רוֹאָה אוֹתְךָ"],
        f: { hebrew: "אֲנִי רוֹאָה אוֹתְךָ", wrong: ["אֲנִי רוֹאָה אַתָּה", "אֲנִי רוֹאָה אוֹתָךְ", "אֲנִי רוֹאֶה אוֹתְךָ"] } },
      { english: "I love you (f.)", hint: "לֶאֱהֹב", hebrew: "אֲנִי אוֹהֵב אוֹתָךְ", wrong: ["אֲנִי אוֹהֵב אַתְּ", "אֲנִי אוֹהֵב אוֹתְךָ", "אֲנִי אוֹהֶבֶת אוֹתָךְ"],
        f: { hebrew: "אֲנִי אוֹהֶבֶת אוֹתָךְ", wrong: ["אֲנִי אוֹהֶבֶת אַתְּ", "אֲנִי אוֹהֶבֶת אוֹתְךָ", "אֲנִי אוֹהֵב אוֹתָךְ"] } },
      { english: "she loves him", hint: "לֶאֱהֹב", hebrew: "הִיא אוֹהֶבֶת אוֹתוֹ", wrong: ["הִיא אוֹהֶבֶת הוּא", "הִיא אוֹהֶבֶת אוֹתָהּ", "הִיא אוֹהֶבֶת אֶת הוּא"] },
      { english: "they (m.) like her", hint: "לֶאֱהֹב", hebrew: "הֵם אוֹהֲבִים אוֹתָהּ", wrong: ["הֵם אוֹהֲבִים הִיא", "הֵם אוֹהֲבִים אוֹתוֹ", "הֵם אוֹהֲבִים אֶת הִיא"] },
      { english: "the teacher asks us", hint: "לִשְׁאֹל", hebrew: "הַמּוֹרֶה שׁוֹאֵל אוֹתָנוּ", wrong: ["הַמּוֹרֶה שׁוֹאֵל אֲנַחְנוּ", "הַמּוֹרֶה שׁוֹאֵל אוֹתָם", "הַמּוֹרֶה שׁוֹאֵל אוֹתִי"] },
      { english: "we invite you all (m.)", hint: "לְהַזְמִין", hebrew: "אֲנַחְנוּ מַזְמִינִים אֶתְכֶם", wrong: ["אֲנַחְנוּ מַזְמִינִים אַתֶּם", "אֲנַחְנוּ מַזְמִינִים אוֹתָם", "אֲנַחְנוּ מַזְמִינִים אֶתְכֶן"],
        f: { hebrew: "אֲנַחְנוּ מַזְמִינוֹת אֶתְכֶם", wrong: ["אֲנַחְנוּ מַזְמִינוֹת אַתֶּם", "אֲנַחְנוּ מַזְמִינוֹת אוֹתָם", "אֲנַחְנוּ מַזְמִינוֹת אֶתְכֶן"] } },
      { english: "you (f.) understand me", hint: "לְהָבִין", hebrew: "אַתְּ מְבִינָה אוֹתִי", wrong: ["אַתְּ מְבִינָה אֲנִי", "אַתָּה מֵבִין אוֹתִי", "אַתְּ מְבִינָה אוֹתָךְ"] },
      { english: "he sees them (m.)", hint: "לִרְאוֹת", hebrew: "הוּא רוֹאֶה אוֹתָם", wrong: ["הוּא רוֹאֶה אוֹתָן", "הוּא רוֹאֶה אֶת הֵם", "הוּא רוֹאֶה הֵם"] },
      { english: "she knows them (f.)", hint: "לְהַכִּיר", hebrew: "הִיא מַכִּירָה אוֹתָן", wrong: ["הִיא מַכִּירָה אוֹתָם", "הִיא מַכִּירָה אֶת הֵן", "הִיא מַכִּיר אוֹתָן"] },
      { english: "they (f.) hear him", hint: "לִשְׁמֹעַ", hebrew: "הֵן שׁוֹמְעוֹת אוֹתוֹ", wrong: ["הֵן שׁוֹמְעוֹת אוֹתָהּ", "הֵן שׁוֹמְעוֹת אֶת הוּא", "הֵם שׁוֹמְעִים אוֹתוֹ"] },
      { english: "you all (m.) see her", hint: "לִרְאוֹת", hebrew: "אַתֶּם רוֹאִים אוֹתָהּ", wrong: ["אַתֶּם רוֹאִים אוֹתוֹ", "אַתֶּם רוֹאִים אֶת הִיא", "אַתֶּן רוֹאוֹת אוֹתָהּ"] },
    ],
  },
  {
    id: "level-11", english: "Past tense", hebrew: "עָבָר",
    words: [
      { english: "he ate", hint: "לֶאֱכֹל", hebrew: "הוּא אָכַל", wrong: ["הוּא אוֹכֵל", "הוּא אָכְלָה", "הוּא יֹאכַל"] },
      { english: "she ate", hint: "לֶאֱכֹל", hebrew: "הִיא אָכְלָה", wrong: ["הִיא אָכַל", "הִיא אוֹכֶלֶת", "הִיא תֹּאכַל"] },
      { english: "I wrote", hint: "לִכְתֹּב", hebrew: "כָּתַבְתִּי", wrong: ["כָּתַבְנוּ", "כָּתַב", "אֶכְתֹּב"] },
      { english: "we wrote", hint: "לִכְתֹּב", hebrew: "כָּתַבְנוּ", wrong: ["כָּתַבְתִּי", "כָּתְבוּ", "נִכְתֹּב"] },
      { english: "they (m.) went", hint: "לָלֶכֶת", hebrew: "הֵם הָלְכוּ", wrong: ["הֵם הוֹלְכִים", "הֵם הָלַךְ", "הֵם יֵלְכוּ"] },
      { english: "you (m.) worked", hint: "לַעֲבֹד", hebrew: "עָבַדְתָּ", wrong: ["עָבַדְתְּ", "עָבַדְתִּי", "תַּעֲבֹד"] },
      { english: "you (f.) spoke", hint: "לְדַבֵּר", hebrew: "דִּבַּרְתְּ", wrong: ["דִּבַּרְתָּ", "מְדַבֶּרֶת", "תְּדַבְּרִי"] },
      { english: "he slept", hint: "לִישֹׁן", hebrew: "הוּא יָשַׁן", wrong: ["הוּא יָשֵׁן", "הוּא יָשְׁנָה", "הוּא יִישַׁן"] },
      { english: "I learned Hebrew", hint: "לִלְמֹד", hebrew: "לָמַדְתִּי עִבְרִית", wrong: ["לָמַדְנוּ עִבְרִית", "אֲנִי לוֹמֵד עִבְרִית", "אֶלְמַד עִבְרִית"] },
      { english: "yesterday it rained", hint: "לָרֶדֶת", hebrew: "אֶתְמוֹל יָרַד גֶּשֶׁם", wrong: ["אֶתְמוֹל יוֹרֵד גֶּשֶׁם", "אֶתְמוֹל יֵרֵד גֶּשֶׁם", "אֶתְמוֹל יָרְדָה גֶּשֶׁם"] },
      { english: "we played in the park", hint: "לְשַׂחֵק", hebrew: "שִׂחַקְנוּ בַּפַּארְק", wrong: ["שִׂחַקְתִּי בַּפַּארְק", "מְשַׂחֲקִים בַּפַּארְק", "נְשַׂחֵק בַּפַּארְק"] },
      { english: "she bought bread", hint: "לִקְנוֹת", hebrew: "הִיא קָנְתָה לֶחֶם", wrong: ["הִיא קָנָה לֶחֶם", "הִיא קוֹנָה לֶחֶם", "הִיא תִּקְנֶה לֶחֶם"] },
      { english: "they (f.) went", hint: "לָלֶכֶת", hebrew: "הֵן הָלְכוּ", wrong: ["הֵן הוֹלְכוֹת", "הֵן הָלְכָה", "הֵן יֵלְכוּ"] },
      { english: "you all (m.) ate", hint: "לֶאֱכֹל", hebrew: "אֲכַלְתֶּם", wrong: ["אֲכַלְתֶּן", "אָכַלְנוּ", "תֹּאכְלוּ"] },
      { english: "you all (f.) wrote", hint: "לִכְתֹּב", hebrew: "כְּתַבְתֶּן", wrong: ["כְּתַבְתֶּם", "כָּתַבְנוּ", "תִּכְתְּבוּ"] },
    ],
  },
  {
    id: "level-12", english: "Past tense with אֶת", hebrew: "עָבָר עִם אֶת",
    words: [
      { english: "I wrote the letter", hint: "לִכְתֹּב", hebrew: "כָּתַבְתִּי אֶת הַמִּכְתָּב", wrong: ["כָּתַבְתִּי הַמִּכְתָּב", "כָּתַבְתִּי אֶת מִכְתָּב", "כָּתַבְנוּ אֶת הַמִּכְתָּב"] },
      { english: "she read the book", hint: "לִקְרֹא", hebrew: "הִיא קָרְאָה אֶת הַסֵּפֶר", wrong: ["הִיא קָרְאָה הַסֵּפֶר", "הִיא קָרָא אֶת הַסֵּפֶר", "הִיא קוֹרֵאת אֶת הַסֵּפֶר"] },
      { english: "we saw the movie", hint: "לִרְאוֹת", hebrew: "רָאִינוּ אֶת הַסֶּרֶט", wrong: ["רָאִינוּ הַסֶּרֶט", "רָאִיתִי אֶת הַסֶּרֶט", "רָאִינוּ אֶת סֶרֶט"] },
      { english: "he opened the window", hint: "לִפְתֹּחַ", hebrew: "הוּא פָּתַח אֶת הַחַלּוֹן", wrong: ["הוּא פָּתַח הַחַלּוֹן", "הוּא פָּתְחָה אֶת הַחַלּוֹן", "הוּא פּוֹתֵחַ אֶת הַחַלּוֹן"] },
      { english: "they (m.) ate the cake", hint: "לֶאֱכֹל", hebrew: "הֵם אָכְלוּ אֶת הָעוּגָה", wrong: ["הֵם אָכְלוּ הָעוּגָה", "הֵם אָכַל אֶת הָעוּגָה", "הֵם אָכְלוּ אֶת עוּגָה"] },
      { english: "I heard the song", hint: "לִשְׁמֹעַ", hebrew: "שָׁמַעְתִּי אֶת הַשִּׁיר", wrong: ["שָׁמַעְתִּי הַשִּׁיר", "שָׁמַעְנוּ אֶת הַשִּׁיר", "אֲנִי שׁוֹמֵעַ אֶת הַשִּׁיר"] },
      { english: "you (m.) bought the car", hint: "לִקְנוֹת", hebrew: "קָנִיתָ אֶת הַמְּכוֹנִית", wrong: ["קָנִיתָ הַמְּכוֹנִית", "קָנִית אֶת הַמְּכוֹנִית", "קָנִיתָ אֶת מְכוֹנִית"] },
      { english: "she met David", hint: "לִפְגֹּשׁ", hebrew: "הִיא פָּגְשָׁה אֶת דָּוִד", wrong: ["הִיא פָּגְשָׁה דָּוִד", "הִיא פָּגַשׁ אֶת דָּוִד", "הִיא פּוֹגֶשֶׁת אֶת דָּוִד"] },
      { english: "we did the homework", hint: "לַעֲשׂוֹת", hebrew: "עָשִׂינוּ אֶת שִׁעוּרֵי הַבַּיִת", wrong: ["עָשִׂינוּ שִׁעוּרֵי הַבַּיִת", "עָשִׂיתִי אֶת שִׁעוּרֵי הַבַּיִת", "עוֹשִׂים אֶת שִׁעוּרֵי הַבַּיִת"] },
      { english: "he saw a dog", hint: "לִרְאוֹת", hebrew: "הוּא רָאָה כֶּלֶב", wrong: ["הוּא רָאָה אֶת כֶּלֶב", "הוּא רָאָה הַכֶּלֶב", "הוּא רָאֲתָה כֶּלֶב"] },
      { english: "I saw them (m.)", hint: "לִרְאוֹת", hebrew: "רָאִיתִי אוֹתָם", wrong: ["רָאִיתִי אוֹתָן", "רָאִיתִי אֶת הֵם", "רָאִינוּ אוֹתָם"] },
      { english: "you all (m.) heard her", hint: "לִשְׁמֹעַ", hebrew: "שְׁמַעְתֶּם אוֹתָהּ", wrong: ["שְׁמַעְתֶּם אוֹתוֹ", "שְׁמַעְתֶּם אֶת הִיא", "שְׁמַעְתֶּן אוֹתָהּ"] },
      { english: "they (f.) met David", hint: "לִפְגֹּשׁ", hebrew: "הֵן פָּגְשׁוּ אֶת דָּוִד", wrong: ["הֵן פָּגְשׁוּ דָּוִד", "הֵן פָּגְשָׁה אֶת דָּוִד", "הֵן פּוֹגְשׁוֹת אֶת דָּוִד"] },
      // More object pronouns (review of the object-pronoun level), now in the past:
      { english: "he saw me", hint: "לִרְאוֹת", hebrew: "הוּא רָאָה אוֹתִי", wrong: ["הוּא רָאָה אֲנִי", "הוּא רָאָה אוֹתוֹ", "הוּא רָאֲתָה אוֹתִי"] },
      { english: "she invited us", hint: "לְהַזְמִין", hebrew: "הִיא הִזְמִינָה אוֹתָנוּ", wrong: ["הִיא הִזְמִינָה אֲנַחְנוּ", "הִיא הִזְמִין אוֹתָנוּ", "הִיא הִזְמִינָה אוֹתָם"] },
      { english: "we asked you (f.)", hint: "לִשְׁאֹל", hebrew: "שָׁאַלְנוּ אוֹתָךְ", wrong: ["שָׁאַלְנוּ אַתְּ", "שָׁאַלְנוּ אוֹתְךָ", "שָׁאַלְתִּי אוֹתָךְ"] },
    ],
  },
  {
    id: "level-13", english: "Future tense", hebrew: "עָתִיד",
    words: [
      { english: "he will eat", hint: "לֶאֱכֹל", hebrew: "הוּא יֹאכַל", wrong: ["הוּא אָכַל", "הוּא תֹּאכַל", "הוּא אוֹכֵל"] },
      { english: "she will eat", hint: "לֶאֱכֹל", hebrew: "הִיא תֹּאכַל", wrong: ["הִיא יֹאכַל", "הִיא אָכְלָה", "הִיא תֹּאכְלִי"] },
      { english: "I will write", hint: "לִכְתֹּב", hebrew: "אֶכְתֹּב", wrong: ["נִכְתֹּב", "כָּתַבְתִּי", "יִכְתֹּב"] },
      { english: "we will go", hint: "לָלֶכֶת", hebrew: "נֵלֵךְ", wrong: ["אֵלֵךְ", "הָלַכְנוּ", "יֵלְכוּ"] },
      { english: "they (m.) will work", hint: "לַעֲבֹד", hebrew: "הֵם יַעַבְדוּ", wrong: ["הֵם עָבְדוּ", "הֵם יַעֲבֹד", "הֵם עוֹבְדִים"] },
      { english: "you (m.) will speak", hint: "לְדַבֵּר", hebrew: "אַתָּה תְּדַבֵּר", wrong: ["אַתְּ תְּדַבְּרִי", "אַתָּה דִּבַּרְתָּ", "אַתָּה יְדַבֵּר"] },
      { english: "you (f.) will read", hint: "לִקְרֹא", hebrew: "אַתְּ תִּקְרְאִי", wrong: ["אַתָּה תִּקְרָא", "אַתְּ קָרָאת", "אַתְּ תִּקְרָא"] },
      { english: "tomorrow I will buy bread", hint: "לִקְנוֹת", hebrew: "מָחָר אֶקְנֶה לֶחֶם", wrong: ["מָחָר קָנִיתִי לֶחֶם", "מָחָר נִקְנֶה לֶחֶם", "מָחָר אֲנִי לִקְנוֹת לֶחֶם"] },
      { english: "tomorrow it will rain", hint: "לָרֶדֶת", hebrew: "מָחָר יֵרֵד גֶּשֶׁם", wrong: ["מָחָר יָרַד גֶּשֶׁם", "מָחָר תֵּרֵד גֶּשֶׁם", "מָחָר יוֹרֵד גֶּשֶׁם"] },
      { english: "we will live in Israel", hint: "לָגוּר", hebrew: "נָגוּר בְּיִשְׂרָאֵל", wrong: ["גַּרְנוּ בְּיִשְׂרָאֵל", "אָגוּר בְּיִשְׂרָאֵל", "נָגוּר לְיִשְׂרָאֵל"] },
      { english: "he will sleep", hint: "לִישֹׁן", hebrew: "הוּא יִישַׁן", wrong: ["הוּא יָשַׁן", "הוּא תִּישַׁן", "הוּא יָשֵׁן"] },
      // (Everyday Hebrew uses these forms for they (f.) / you all (f.). Old-style books use תִּכְתֹּבְנָה, תִּישַׁנָּה.)
      { english: "they (f.) will write", hint: "לִכְתֹּב", hebrew: "הֵן יִכְתְּבוּ", wrong: ["הֵן כָּתְבוּ", "הֵן יִכְתֹּב", "הֵן כּוֹתְבוֹת"] },
      { english: "you all (m.) will play", hint: "לְשַׂחֵק", hebrew: "אַתֶּם תְּשַׂחֲקוּ", wrong: ["אַתֶּם שִׂחַקְתֶּם", "אַתֶּם יְשַׂחֲקוּ", "אַתֶּם מְשַׂחֲקִים"] },
      { english: "you all (f.) will sleep", hint: "לִישֹׁן", hebrew: "אַתֶּן תִּישְׁנוּ", wrong: ["אַתֶּן יְשַׁנְתֶּן", "אַתֶּן יִישְׁנוּ", "אַתֶּן יְשֵׁנוֹת"] },
    ],
  },
  {
    id: "level-14", english: "Future tense with אֶת", hebrew: "עָתִיד עִם אֶת",
    words: [
      { english: "she will read the book", hint: "לִקְרֹא", hebrew: "הִיא תִּקְרָא אֶת הַסֵּפֶר", wrong: ["הִיא תִּקְרָא הַסֵּפֶר", "הִיא יִקְרָא אֶת הַסֵּפֶר", "הִיא קָרְאָה אֶת הַסֵּפֶר"] },
      { english: "I will write the letter", hint: "לִכְתֹּב", hebrew: "אֶכְתֹּב אֶת הַמִּכְתָּב", wrong: ["אֶכְתֹּב הַמִּכְתָּב", "אֶכְתֹּב אֶת מִכְתָּב", "כָּתַבְתִּי אֶת הַמִּכְתָּב"] },
      { english: "we will see the movie", hint: "לִרְאוֹת", hebrew: "נִרְאֶה אֶת הַסֶּרֶט", wrong: ["נִרְאֶה הַסֶּרֶט", "רָאִינוּ אֶת הַסֶּרֶט", "אֶרְאֶה אֶת הַסֶּרֶט"] },
      { english: "he will open the door", hint: "לִפְתֹּחַ", hebrew: "הוּא יִפְתַּח אֶת הַדֶּלֶת", wrong: ["הוּא יִפְתַּח הַדֶּלֶת", "הוּא פָּתַח אֶת הַדֶּלֶת", "הוּא תִּפְתַּח אֶת הַדֶּלֶת"] },
      { english: "they (m.) will eat the cake", hint: "לֶאֱכֹל", hebrew: "הֵם יֹאכְלוּ אֶת הָעוּגָה", wrong: ["הֵם יֹאכְלוּ הָעוּגָה", "הֵם אָכְלוּ אֶת הָעוּגָה", "הֵם יֹאכַל אֶת הָעוּגָה"] },
      { english: "you (m.) will buy the car", hint: "לִקְנוֹת", hebrew: "אַתָּה תִּקְנֶה אֶת הַמְּכוֹנִית", wrong: ["אַתָּה תִּקְנֶה הַמְּכוֹנִית", "אַתָּה קָנִיתָ אֶת הַמְּכוֹנִית", "אַתָּה יִקְנֶה אֶת הַמְּכוֹנִית"] },
      { english: "I will meet David", hint: "לִפְגֹּשׁ", hebrew: "אֶפְגֹּשׁ אֶת דָּוִד", wrong: ["אֶפְגֹּשׁ דָּוִד", "פָּגַשְׁתִּי אֶת דָּוִד", "נִפְגֹּשׁ אֶת דָּוִד"] },
      { english: "we will do the homework", hint: "לַעֲשׂוֹת", hebrew: "נַעֲשֶׂה אֶת שִׁעוּרֵי הַבַּיִת", wrong: ["נַעֲשֶׂה שִׁעוּרֵי הַבַּיִת", "עָשִׂינוּ אֶת שִׁעוּרֵי הַבַּיִת", "אֶעֱשֶׂה אֶת שִׁעוּרֵי הַבַּיִת"] },
      { english: "she will hear the song", hint: "לִשְׁמֹעַ", hebrew: "הִיא תִּשְׁמַע אֶת הַשִּׁיר", wrong: ["הִיא תִּשְׁמַע הַשִּׁיר", "הִיא שָׁמְעָה אֶת הַשִּׁיר", "הִיא יִשְׁמַע אֶת הַשִּׁיר"] },
      { english: "we will meet them (f.)", hint: "לִפְגֹּשׁ", hebrew: "נִפְגֹּשׁ אוֹתָן", wrong: ["נִפְגֹּשׁ אוֹתָם", "נִפְגֹּשׁ אֶת הֵן", "אֶפְגֹּשׁ אוֹתָן"] },
      { english: "you (f.) will read the letter", hint: "לִקְרֹא", hebrew: "אַתְּ תִּקְרְאִי אֶת הַמִּכְתָּב", wrong: ["אַתְּ תִּקְרְאִי הַמִּכְתָּב", "אַתָּה תִּקְרָא אֶת הַמִּכְתָּב", "אַתְּ קָרָאת אֶת הַמִּכְתָּב"] },
      { english: "you all (m.) will hear him", hint: "לִשְׁמֹעַ", hebrew: "אַתֶּם תִּשְׁמְעוּ אוֹתוֹ", wrong: ["אַתֶּם תִּשְׁמְעוּ אוֹתָהּ", "אַתֶּם שְׁמַעְתֶּם אוֹתוֹ", "אַתֶּם תִּשְׁמְעוּ אֶת הוּא"] },
      // More object pronouns (review of the object-pronoun level), now in the future:
      { english: "I will see you (m.) tomorrow", hint: "לִרְאוֹת", hebrew: "אֶרְאֶה אוֹתְךָ מָחָר", wrong: ["אֶרְאֶה אַתָּה מָחָר", "אֶרְאֶה אוֹתָךְ מָחָר", "נִרְאֶה אוֹתְךָ מָחָר"] },
      { english: "she will invite us", hint: "לְהַזְמִין", hebrew: "הִיא תַּזְמִין אוֹתָנוּ", wrong: ["הִיא תַּזְמִין אֲנַחְנוּ", "הִיא הִזְמִינָה אוֹתָנוּ", "הִיא תַּזְמִין אוֹתָם"] },
      { english: "they (m.) will ask me", hint: "לִשְׁאֹל", hebrew: "הֵם יִשְׁאֲלוּ אוֹתִי", wrong: ["הֵם יִשְׁאֲלוּ אֲנִי", "הֵם שָׁאֲלוּ אוֹתִי", "הֵם יִשְׁאֲלוּ אוֹתוֹ"] },
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
  // Level 17 (2026-11-12): describing words made from a verb (פָּעוּל: פָּתוּחַ, סָגוּר, כָּתוּב).
  // "The door IS OPEN" (פְּתוּחָה, a description) is different from "I OPEN the door" (פּוֹתֵחַ, an action)
  // and from "the door WAS OPENED" (נִפְתְּחָה, the passive from level 16). The wrong answers mix them up,
  // plus the wrong gender/number (פָּתוּחַ / פְּתוּחָה / פְּתוּחִים / פְּתוּחוֹת).
  {
    id: "level-participles", english: "Adjectives from verbs: open, closed, written", hebrew: "תֹּאַר מִפֹּעַל: פָּתוּחַ, סָגוּר, כָּתוּב",
    words: [
      // Short ones
      { english: "open", hint: "לִפְתֹּחַ", hebrew: "פָּתוּחַ", wrong: ["פּוֹתֵחַ", "נִפְתַּח", "פֶּתַח"] },
      { english: "closed", hint: "לִסְגֹּר", hebrew: "סָגוּר", wrong: ["סוֹגֵר", "נִסְגַּר", "סָגַר"] },
      { english: "broken", hint: "לִשְׁבֹּר", hebrew: "שָׁבוּר", wrong: ["שׁוֹבֵר", "נִשְׁבַּר", "שֶׁבֶר"] },
      { english: "written", hint: "לִכְתֹּב", hebrew: "כָּתוּב", wrong: ["כּוֹתֵב", "נִכְתַּב", "כְּתָב"] },
      { english: "busy", hint: "לַעֲסֹק", hebrew: "עָסוּק", wrong: ["עוֹסֵק", "עָסַק", "עֵסֶק"] },
      { english: "loved, favorite", hint: "לֶאֱהֹב", hebrew: "אָהוּב", wrong: ["אוֹהֵב", "אָהַב", "אַהֲבָה"] },
      { english: "dressed", hint: "לִלְבֹּשׁ", hebrew: "לָבוּשׁ", wrong: ["לוֹבֵשׁ", "לָבַשׁ", "לְבִישָׁה"] },
      { english: "well known", hint: "לָדַעַת", hebrew: "יָדוּעַ", wrong: ["יוֹדֵעַ", "יָדַע", "נוֹדַע"] },
      // Sentences: is it a description or an action?
      { english: "the door is open", hint: "לִפְתֹּחַ", hebrew: "הַדֶּלֶת פְּתוּחָה", wrong: ["הַדֶּלֶת פּוֹתַחַת", "הַדֶּלֶת פָּתוּחַ", "הַדֶּלֶת נִפְתְּחָה"] },
      { english: "I open the door", hint: "לִפְתֹּחַ", hebrew: "אֲנִי פּוֹתֵחַ אֶת הַדֶּלֶת", wrong: ["אֲנִי פָּתוּחַ אֶת הַדֶּלֶת", "אֲנִי פּוֹתֵחַ הַדֶּלֶת", "אֲנִי פּוֹתַחַת אֶת הַדֶּלֶת"],
        f: { hebrew: "אֲנִי פּוֹתַחַת אֶת הַדֶּלֶת", wrong: ["אֲנִי פְּתוּחָה אֶת הַדֶּלֶת", "אֲנִי פּוֹתַחַת הַדֶּלֶת", "אֲנִי פּוֹתֵחַ אֶת הַדֶּלֶת"] } },
      { english: "the store is closed", hint: "לִסְגֹּר", hebrew: "הַחֲנוּת סְגוּרָה", wrong: ["הַחֲנוּת סוֹגֶרֶת", "הַחֲנוּת סָגוּר", "הַחֲנוּת נִסְגְּרָה"] },
      { english: "the stores are closed on Saturday", hint: "לִסְגֹּר", hebrew: "הַחֲנֻיּוֹת סְגוּרוֹת בְּשַׁבָּת", wrong: ["הַחֲנֻיּוֹת סוֹגְרוֹת בְּשַׁבָּת", "הַחֲנֻיּוֹת סְגוּרִים בְּשַׁבָּת", "הַחֲנֻיּוֹת סָגוּר בְּשַׁבָּת"] },
      { english: "the window is broken", hint: "לִשְׁבֹּר", hebrew: "הַחַלּוֹן שָׁבוּר", wrong: ["הַחַלּוֹן שׁוֹבֵר", "הַחַלּוֹן שְׁבוּרָה", "הַחַלּוֹן נִשְׁבַּר"] },
      { english: "the letter is written in Hebrew", hint: "לִכְתֹּב", hebrew: "הַמִּכְתָּב כָּתוּב בְּעִבְרִית", wrong: ["הַמִּכְתָּב כּוֹתֵב בְּעִבְרִית", "הַמִּכְתָּב כְּתוּבָה בְּעִבְרִית", "הַמִּכְתָּב כָּתַב בְּעִבְרִית"] },
      { english: "your (m.) name is written on the board", hint: "לִכְתֹּב", hebrew: "הַשֵּׁם שֶׁלְּךָ כָּתוּב עַל הַלּוּחַ", wrong: ["הַשֵּׁם שֶׁלְּךָ כּוֹתֵב עַל הַלּוּחַ", "הַשֵּׁם שֶׁלְּךָ כְּתוּבָה עַל הַלּוּחַ", "הַשֵּׁם שֶׁלְּךָ כָּתוּב לַלּוּחַ"] },
      { english: "I am busy today", hint: "לַעֲסֹק", hebrew: "אֲנִי עָסוּק הַיּוֹם", wrong: ["אֲנִי עוֹסֵק הַיּוֹם", "אֲנִי עֲסוּקָה הַיּוֹם", "אֲנִי עָסַקְתִּי הַיּוֹם"],
        f: { hebrew: "אֲנִי עֲסוּקָה הַיּוֹם", wrong: ["אֲנִי עוֹסֶקֶת הַיּוֹם", "אֲנִי עָסוּק הַיּוֹם", "אֲנִי עָסַקְתִּי הַיּוֹם"] } },
      { english: "my favorite food", hint: "לֶאֱהֹב", hebrew: "הָאֹכֶל הָאָהוּב עָלַי", wrong: ["הָאֹכֶל הָאוֹהֵב עָלַי", "הָאֹכֶל הָאֲהוּבָה עָלַי", "הָאֹכֶל הָאָהוּב עָלֶיהָ"] },
      { english: "the song is loved by everyone", hint: "לֶאֱהֹב", hebrew: "הַשִּׁיר אָהוּב עַל כֻּלָּם", wrong: ["הַשִּׁיר אוֹהֵב אֶת כֻּלָּם", "הַשִּׁיר אֲהוּבָה עַל כֻּלָּם", "הַשִּׁיר אָהַב עַל כֻּלָּם"] },
      { english: "she is dressed in black", hint: "לִלְבֹּשׁ", hebrew: "הִיא לְבוּשָׁה בְּשָׁחֹר", wrong: ["הִיא לוֹבֶשֶׁת בְּשָׁחֹר", "הִיא לָבוּשׁ בְּשָׁחֹר", "הִיא לָבְשָׁה בְּשָׁחֹר"] },
      { english: "the windows were open all night", hint: "לִפְתֹּחַ", hebrew: "הַחַלּוֹנוֹת הָיוּ פְּתוּחִים כָּל הַלַּיְלָה", wrong: ["הַחַלּוֹנוֹת הָיוּ פְּתוּחוֹת כָּל הַלַּיְלָה", "הַחַלּוֹנוֹת הָיוּ פּוֹתְחִים כָּל הַלַּיְלָה", "הַחַלּוֹנוֹת נִפְתְּחוּ כָּל הַלַּיְלָה"] },
    ],
  },
  // Level 18 (2026-11-12): real sentences that combine everything so far.
  {
    id: "level-real-life", english: "Real sentences: everyday life", hebrew: "מִשְׁפָּטִים אֲמִתִּיִּים: חַיֵּי יוֹם־יוֹם",
    words: [
      // Short ones
      { english: "when I come home", hint: "לַחֲזֹר", hebrew: "כְּשֶׁאֲנִי חוֹזֵר הַבַּיְתָה", wrong: ["שֶׁאֲנִי חוֹזֵר הַבַּיְתָה", "כְּשֶׁאֲנִי חוֹזֶרֶת הַבַּיְתָה", "כְּשֶׁאֲנִי חוֹזֵר בַּבַּיִת"], f: { hebrew: "כְּשֶׁאֲנִי חוֹזֶרֶת הַבַּיְתָה", wrong: ["שֶׁאֲנִי חוֹזֶרֶת הַבַּיְתָה", "כְּשֶׁאֲנִי חוֹזֵר הַבַּיְתָה", "כְּשֶׁאֲנִי חוֹזֶרֶת בַּבַּיִת"] } },
      { english: "the store is open", hint: "לִפְתֹּחַ", hebrew: "הַחֲנוּת פְּתוּחָה", wrong: ["הַחֲנוּת פּוֹתַחַת", "הַחֲנוּת פָּתוּחַ", "הַחֲנוּת נִפְתְּחָה"] },
      { english: "with my friends", hebrew: "עִם הַחֲבֵרִים שֶׁלִּי", wrong: ["עִם הַחֲבֵרִים שֶׁלָּנוּ", "עִם הַחֲבֵרִים שֶׁלּוֹ", "לַחֲבֵרִים שֶׁלִּי"] },
      { english: "I know him", hint: "לְהַכִּיר", hebrew: "אֲנִי מַכִּיר אוֹתוֹ", wrong: ["אֲנִי מַכִּיר הוּא", "אֲנִי מַכִּיר אוֹתָהּ", "אֲנִי מַכִּירָה אוֹתוֹ"], f: { hebrew: "אֲנִי מַכִּירָה אוֹתוֹ", wrong: ["אֲנִי מַכִּירָה הוּא", "אֲנִי מַכִּירָה אוֹתָהּ", "אֲנִי מַכִּיר אוֹתוֹ"] } },
      { english: "on the weekend", hebrew: "בְּסוֹף הַשָּׁבוּעַ", wrong: ["לְסוֹף הַשָּׁבוּעַ", "מִסּוֹף הַשָּׁבוּעַ", "בַּסּוֹף הַשָּׁבוּעַ"] },
      // Full sentences
      { english: "I want to eat pizza tonight", hebrew: "אֲנִי רוֹצֶה לֶאֱכֹל פִּיצָה הָעֶרֶב", wrong: ["אֲנִי רוֹצָה לֶאֱכֹל פִּיצָה הָעֶרֶב", "אֲנִי רוֹצֶה אוֹכֵל פִּיצָה הָעֶרֶב", "אֲנִי רוֹצֶה לֶאֱכֹל אֶת פִּיצָה הָעֶרֶב"], f: { hebrew: "אֲנִי רוֹצָה לֶאֱכֹל פִּיצָה הָעֶרֶב", wrong: ["אֲנִי רוֹצֶה לֶאֱכֹל פִּיצָה הָעֶרֶב", "אֲנִי רוֹצָה אוֹכֶלֶת פִּיצָה הָעֶרֶב", "אֲנִי רוֹצָה לֶאֱכֹל אֶת פִּיצָה הָעֶרֶב"] } },
      { english: "my mom is cooking dinner in the kitchen", hint: "לְבַשֵּׁל", hebrew: "אִמָּא שֶׁלִּי מְבַשֶּׁלֶת אֲרוּחַת עֶרֶב בַּמִּטְבָּח", wrong: ["אִמָּא שֶׁלִּי מְבַשֵּׁל אֲרוּחַת עֶרֶב בַּמִּטְבָּח", "אִמָּא שֶׁלִּי מְבַשֶּׁלֶת אֲרוּחַת עֶרֶב לַמִּטְבָּח", "אִמָּא שֶׁלִּי בִּשְּׁלָה אֲרוּחַת עֶרֶב בַּמִּטְבָּח"] },
      { english: "we go to school by bus", hint: "לִנְסֹעַ", hebrew: "אֲנַחְנוּ נוֹסְעִים לְבֵית הַסֵּפֶר בְּאוֹטוֹבּוּס", wrong: ["אֲנַחְנוּ נוֹסֵעַ לְבֵית הַסֵּפֶר בְּאוֹטוֹבּוּס", "אֲנַחְנוּ נוֹסְעִים בְּבֵית הַסֵּפֶר בְּאוֹטוֹבּוּס", "אֲנַחְנוּ לִנְסֹעַ לְבֵית הַסֵּפֶר בְּאוֹטוֹבּוּס"], f: { hebrew: "אֲנַחְנוּ נוֹסְעוֹת לְבֵית הַסֵּפֶר בְּאוֹטוֹבּוּס", wrong: ["אֲנַחְנוּ נוֹסַעַת לְבֵית הַסֵּפֶר בְּאוֹטוֹבּוּס", "אֲנַחְנוּ נוֹסְעוֹת בְּבֵית הַסֵּפֶר בְּאוֹטוֹבּוּס", "אֲנַחְנוּ לִנְסֹעַ לְבֵית הַסֵּפֶר בְּאוֹטוֹבּוּס"] } },
      { english: "my brother likes to play soccer after school", hebrew: "אָחִי אוֹהֵב לְשַׂחֵק כַּדּוּרֶגֶל אַחֲרֵי בֵּית הַסֵּפֶר", wrong: ["אָחִי אוֹהֶבֶת לְשַׂחֵק כַּדּוּרֶגֶל אַחֲרֵי בֵּית הַסֵּפֶר", "אָחִי אוֹהֵב מְשַׂחֵק כַּדּוּרֶגֶל אַחֲרֵי בֵּית הַסֵּפֶר", "אָחִי רוֹצֶה לְשַׂחֵק כַּדּוּרֶגֶל אַחֲרֵי בֵּית הַסֵּפֶר"] },
      { english: "the kids who live here are my friends", hint: "לָגוּר", hebrew: "הַיְלָדִים שֶׁגָּרִים כָּאן הֵם הַחֲבֵרִים שֶׁלִּי", wrong: ["הַיְלָדִים גָּרִים כָּאן הֵם הַחֲבֵרִים שֶׁלִּי", "הַיְלָדִים שֶׁגָּר כָּאן הֵם הַחֲבֵרִים שֶׁלִּי", "הַיְלָדִים כְּשֶׁגָּרִים כָּאן הֵם הַחֲבֵרִים שֶׁלִּי"] },
      { english: "when I'm tired, I go to sleep early", hint: "לָלֶכֶת", hebrew: "כְּשֶׁאֲנִי עָיֵף, אֲנִי הוֹלֵךְ לִישֹׁן מֻקְדָּם", wrong: ["כְּשֶׁאֲנִי עָיֵף, אֲנִי הוֹלֵךְ יָשֵׁן מֻקְדָּם", "שֶׁאֲנִי עָיֵף, אֲנִי הוֹלֵךְ לִישֹׁן מֻקְדָּם", "כְּשֶׁאֲנִי עָיֵף, אֲנִי הָלַכְתִּי לִישֹׁן מֻקְדָּם"], f: { hebrew: "כְּשֶׁאֲנִי עֲיֵפָה, אֲנִי הוֹלֶכֶת לִישֹׁן מֻקְדָּם", wrong: ["כְּשֶׁאֲנִי עֲיֵפָה, אֲנִי הוֹלֶכֶת יְשֵׁנָה מֻקְדָּם", "שֶׁאֲנִי עֲיֵפָה, אֲנִי הוֹלֶכֶת לִישֹׁן מֻקְדָּם", "כְּשֶׁאֲנִי עֲיֵפָה, אֲנִי הָלַכְתִּי לִישֹׁן מֻקְדָּם"] } },
      { english: "Grandma invites us every Friday", hint: "לְהַזְמִין", hebrew: "סַבְתָּא מַזְמִינָה אוֹתָנוּ כָּל יוֹם שִׁשִּׁי", wrong: ["סַבְתָּא מַזְמִינָה אֲנַחְנוּ כָּל יוֹם שִׁשִּׁי", "סַבְתָּא מַזְמִין אוֹתָנוּ כָּל יוֹם שִׁשִּׁי", "סַבְתָּא מַזְמִינָה אוֹתָם כָּל יוֹם שִׁשִּׁי"] },
      { english: "do you (m.) want to come with us to the beach?", hebrew: "אַתָּה רוֹצֶה לָבוֹא אִתָּנוּ לַיָּם?", wrong: ["אַתְּ רוֹצָה לָבוֹא אִתָּנוּ לַיָּם?", "אַתָּה רוֹצֶה בָּא אִתָּנוּ לַיָּם?", "אַתָּה רוֹצֶה לָבוֹא אִתָּנוּ בַּיָּם?"] },
      { english: "the homework is written on the board", hint: "לִכְתֹּב", hebrew: "שִׁעוּרֵי הַבַּיִת כְּתוּבִים עַל הַלּוּחַ", wrong: ["שִׁעוּרֵי הַבַּיִת כָּתוּב עַל הַלּוּחַ", "שִׁעוּרֵי הַבַּיִת כּוֹתְבִים עַל הַלּוּחַ", "שִׁעוּרֵי הַבַּיִת כְּתוּבִים לַלּוּחַ"] },
      { english: "I don't like to get up early on Saturday", hebrew: "אֲנִי לֹא אוֹהֵב לָקוּם מֻקְדָּם בְּשַׁבָּת", wrong: ["אֲנִי לֹא אוֹהֶבֶת לָקוּם מֻקְדָּם בְּשַׁבָּת", "אֲנִי לֹא אוֹהֵב קָם מֻקְדָּם בְּשַׁבָּת", "לֹא אֲנִי אוֹהֵב לָקוּם מֻקְדָּם בְּשַׁבָּת"], f: { hebrew: "אֲנִי לֹא אוֹהֶבֶת לָקוּם מֻקְדָּם בְּשַׁבָּת", wrong: ["אֲנִי לֹא אוֹהֵב לָקוּם מֻקְדָּם בְּשַׁבָּת", "אֲנִי לֹא אוֹהֶבֶת קָמָה מֻקְדָּם בְּשַׁבָּת", "לֹא אֲנִי אוֹהֶבֶת לָקוּם מֻקְדָּם בְּשַׁבָּת"] } },
      { english: "we eat dinner together when Dad comes home", hint: "לֶאֱכֹל", hebrew: "אֲנַחְנוּ אוֹכְלִים אֲרוּחַת עֶרֶב בְּיַחַד כְּשֶׁאַבָּא חוֹזֵר הַבַּיְתָה", wrong: ["אֲנַחְנוּ אוֹכְלִים אֲרוּחַת עֶרֶב בְּיַחַד שֶׁאַבָּא חוֹזֵר הַבַּיְתָה", "אֲנַחְנוּ אוֹכֵל אֲרוּחַת עֶרֶב בְּיַחַד כְּשֶׁאַבָּא חוֹזֵר הַבַּיְתָה", "אֲנַחְנוּ אוֹכְלִים אֲרוּחַת עֶרֶב בְּיַחַד כְּשֶׁאַבָּא חוֹזֶרֶת הַבַּיְתָה"], f: { hebrew: "אֲנַחְנוּ אוֹכְלוֹת אֲרוּחַת עֶרֶב בְּיַחַד כְּשֶׁאַבָּא חוֹזֵר הַבַּיְתָה", wrong: ["אֲנַחְנוּ אוֹכְלוֹת אֲרוּחַת עֶרֶב בְּיַחַד שֶׁאַבָּא חוֹזֵר הַבַּיְתָה", "אֲנַחְנוּ אוֹכֶלֶת אֲרוּחַת עֶרֶב בְּיַחַד כְּשֶׁאַבָּא חוֹזֵר הַבַּיְתָה", "אֲנַחְנוּ אוֹכְלוֹת אֲרוּחַת עֶרֶב בְּיַחַד כְּשֶׁאַבָּא חוֹזֶרֶת הַבַּיְתָה"] } },
      { english: "I can't find my phone", hint: "לִמְצֹא", hebrew: "אֲנִי לֹא מוֹצֵא אֶת הַטֶּלֶפוֹן שֶׁלִּי", wrong: ["אֲנִי לֹא מוֹצֵא הַטֶּלֶפוֹן שֶׁלִּי", "אֲנִי לֹא מוֹצֵאת אֶת הַטֶּלֶפוֹן שֶׁלִּי", "אֲנִי לֹא מוֹצֵא אֶת הַטֶּלֶפוֹן שֶׁלּוֹ"], f: { hebrew: "אֲנִי לֹא מוֹצֵאת אֶת הַטֶּלֶפוֹן שֶׁלִּי", wrong: ["אֲנִי לֹא מוֹצֵאת הַטֶּלֶפוֹן שֶׁלִּי", "אֲנִי לֹא מוֹצֵא אֶת הַטֶּלֶפוֹן שֶׁלִּי", "אֲנִי לֹא מוֹצֵאת אֶת הַטֶּלֶפוֹן שֶׁלָּהּ"] } },
      { english: "we have a test tomorrow, so I'm studying", hint: "לִלְמֹד", hebrew: "יֵשׁ לָנוּ מִבְחָן מָחָר, אָז אֲנִי לוֹמֵד", wrong: ["יֵשׁ לָנוּ מִבְחָן מָחָר, אָז אֲנִי לוֹמֶדֶת", "יֵשׁ לָנוּ מִבְחָן מָחָר, אָז אֲנִי לִלְמֹד", "יֵשׁ לָנוּ מִבְחָן מָחָר, אָז אֲנִי לָמַדְתִּי"], f: { hebrew: "יֵשׁ לָנוּ מִבְחָן מָחָר, אָז אֲנִי לוֹמֶדֶת", wrong: ["יֵשׁ לָנוּ מִבְחָן מָחָר, אָז אֲנִי לוֹמֵד", "יֵשׁ לָנוּ מִבְחָן מָחָר, אָז אֲנִי לִלְמֹד", "יֵשׁ לָנוּ מִבְחָן מָחָר, אָז אֲנִי לָמַדְתִּי"] } },
    ],
  },
  // Level 19 (2026-11-12): real sentences: telling what happened (past mixed with everything else).
  {
    id: "level-real-stories", english: "Real sentences: telling what happened", hebrew: "מִשְׁפָּטִים אֲמִתִּיִּים: מָה קָרָה",
    words: [
      // Short ones
      { english: "when I came home", hint: "לַחֲזֹר", hebrew: "כְּשֶׁחָזַרְתִּי הַבַּיְתָה", wrong: ["שֶׁחָזַרְתִּי הַבַּיְתָה", "כְּשֶׁאֲנִי חוֹזֵר הַבַּיְתָה", "כְּשֶׁחָזַרְנוּ הַבַּיְתָה"] },
      { english: "I told him", hint: "לוֹמַר", hebrew: "אָמַרְתִּי לוֹ", wrong: ["אָמַרְתִּי אוֹתוֹ", "אָמַרְתִּי לָהּ", "הוּא אָמַר לִי"] },
      { english: "the door was locked", hint: "לִנְעֹל", hebrew: "הַדֶּלֶת הָיְתָה נְעוּלָה", wrong: ["הַדֶּלֶת הָיְתָה נוֹעֶלֶת", "הַדֶּלֶת הָיְתָה נָעוּל", "הַדֶּלֶת נְעוּלָה"] },
      { english: "he didn't see me", hint: "לִרְאוֹת", hebrew: "הוּא לֹא רָאָה אוֹתִי", wrong: ["הוּא לֹא רָאָה אֲנִי", "הוּא לֹא רָאָה אוֹתוֹ", "הוּא לֹא רוֹאֶה אוֹתִי"] },
      { english: "the window broke", hint: "לִשְׁבֹּר", hebrew: "הַחַלּוֹן נִשְׁבַּר", wrong: ["הַחַלּוֹן שָׁבַר", "הַחַלּוֹן שָׁבוּר", "הַחַלּוֹן נִשְׁבְּרָה"] },
      // Full sentences
      { english: "when I came home, the door was open", hint: "לַחֲזֹר", hebrew: "כְּשֶׁחָזַרְתִּי הַבַּיְתָה, הַדֶּלֶת הָיְתָה פְּתוּחָה", wrong: ["כְּשֶׁחָזַרְתִּי הַבַּיְתָה, הַדֶּלֶת הָיְתָה פּוֹתַחַת", "שֶׁחָזַרְתִּי הַבַּיְתָה, הַדֶּלֶת הָיְתָה פְּתוּחָה", "כְּשֶׁחָזַרְתִּי הַבַּיְתָה, הַדֶּלֶת הָיְתָה פָּתוּחַ"] },
      { english: "yesterday I met Dana at the mall", hint: "לִפְגֹּשׁ", hebrew: "אֶתְמוֹל פָּגַשְׁתִּי אֶת דָּנָה בַּקַּנְיוֹן", wrong: ["אֶתְמוֹל פָּגַשְׁתִּי דָּנָה בַּקַּנְיוֹן", "אֶתְמוֹל אֶפְגֹּשׁ אֶת דָּנָה בַּקַּנְיוֹן", "אֶתְמוֹל פָּגַשְׁתִּי אֶת דָּנָה לַקַּנְיוֹן"] },
      { english: "she told me that she is moving to Haifa", hint: "לוֹמַר", hebrew: "הִיא אָמְרָה לִי שֶׁהִיא עוֹבֶרֶת לְחֵיפָה", wrong: ["הִיא אָמְרָה אוֹתִי שֶׁהִיא עוֹבֶרֶת לְחֵיפָה", "הִיא אָמַר לִי שֶׁהִיא עוֹבֶרֶת לְחֵיפָה", "הִיא אָמְרָה לִי שֶׁהִיא עוֹבֶרֶת בְּחֵיפָה"] },
      { english: "we saw the movie that everyone is talking about", hint: "לִרְאוֹת", hebrew: "רָאִינוּ אֶת הַסֶּרֶט שֶׁכֻּלָּם מְדַבְּרִים עָלָיו", wrong: ["רָאִינוּ הַסֶּרֶט שֶׁכֻּלָּם מְדַבְּרִים עָלָיו", "רָאִינוּ אֶת הַסֶּרֶט כֻּלָּם מְדַבְּרִים עָלָיו", "רָאִינוּ אֶת הַסֶּרֶט שֶׁכֻּלָּם מְדַבְּרִים עָלֶיהָ"] },
      { english: "the house was built by my grandfather", hint: "לִבְנוֹת", hebrew: "הַבַּיִת נִבְנָה עַל יְדֵי סַבָּא שֶׁלִּי", wrong: ["הַבַּיִת בָּנָה עַל יְדֵי סַבָּא שֶׁלִּי", "הַבַּיִת נִבְנְתָה עַל יְדֵי סַבָּא שֶׁלִּי", "הַבַּיִת יִבָּנֶה עַל יְדֵי סַבָּא שֶׁלִּי"] },
      { english: "when it started to rain, we went home", hint: "לָלֶכֶת", hebrew: "כְּשֶׁהִתְחִיל לָרֶדֶת גֶּשֶׁם, הָלַכְנוּ הַבַּיְתָה", wrong: ["כְּשֶׁהִתְחִיל לָרֶדֶת גֶּשֶׁם, הָלַכְנוּ בַּבַּיִת", "כְּשֶׁהִתְחִיל יוֹרֵד גֶּשֶׁם, הָלַכְנוּ הַבַּיְתָה", "כְּשֶׁהִתְחִיל לָרֶדֶת גֶּשֶׁם, נֵלֵךְ הַבַּיְתָה"] },
      { english: "the teacher (f.) asked me why I didn't come", hint: "לִשְׁאֹל", hebrew: "הַמּוֹרָה שָׁאֲלָה אוֹתִי לָמָּה לֹא בָּאתִי", wrong: ["הַמּוֹרָה שָׁאֲלָה אֲנִי לָמָּה לֹא בָּאתִי", "הַמּוֹרָה שָׁאַל אוֹתִי לָמָּה לֹא בָּאתִי", "הַמּוֹרָה שָׁאֲלָה אוֹתִי לָמָּה לֹא אָבוֹא"] },
      { english: "I lost the book that you (m.) gave me", hint: "לְאַבֵּד", hebrew: "אִבַּדְתִּי אֶת הַסֵּפֶר שֶׁנָּתַתָּ לִי", wrong: ["אִבַּדְתִּי הַסֵּפֶר שֶׁנָּתַתָּ לִי", "אִבַּדְתִּי אֶת הַסֵּפֶר שֶׁנָּתַתְּ לִי", "אִבַּדְתִּי אֶת הַסֵּפֶר כְּשֶׁנָּתַתָּ לִי"] },
      { english: "my phone fell and the screen broke", hint: "לִפֹּל", hebrew: "הַטֶּלֶפוֹן שֶׁלִּי נָפַל וְהַמָּסָךְ נִשְׁבַּר", wrong: ["הַטֶּלֶפוֹן שֶׁלִּי נָפַל וְהַמָּסָךְ שָׁבַר", "הַטֶּלֶפוֹן שֶׁלִּי נָפְלָה וְהַמָּסָךְ נִשְׁבַּר", "הַטֶּלֶפוֹן שֶׁלִּי נָפַל וְהַמָּסָךְ נִשְׁבְּרָה"] },
      { english: "everyone was already sitting when we arrived", hint: "לְהַגִּיעַ", hebrew: "כֻּלָּם כְּבָר יָשְׁבוּ כְּשֶׁהִגַּעְנוּ", wrong: ["כֻּלָּם כְּבָר יָשְׁבוּ שֶׁהִגַּעְנוּ", "כֻּלָּם כְּבָר יָשְׁבוּ כְּשֶׁנַּגִּיעַ", "כֻּלָּם כְּבָר יָשַׁב כְּשֶׁהִגַּעְנוּ"] },
      { english: "we ate the cake that Mom baked", hint: "לֶאֱכֹל", hebrew: "אָכַלְנוּ אֶת הָעוּגָה שֶׁאִמָּא אָפְתָה", wrong: ["אָכַלְנוּ הָעוּגָה שֶׁאִמָּא אָפְתָה", "אָכַלְנוּ אֶת הָעוּגָה שֶׁאִמָּא אָפָה", "אָכַלְנוּ אֶת הָעוּגָה שֶׁאִמָּא אוֹפָה"] },
      { english: "he invited me to his party, but I didn't go", hint: "לְהַזְמִין", hebrew: "הוּא הִזְמִין אוֹתִי לַמְּסִבָּה שֶׁלּוֹ, אֲבָל לֹא הָלַכְתִּי", wrong: ["הוּא הִזְמִין אֲנִי לַמְּסִבָּה שֶׁלּוֹ, אֲבָל לֹא הָלַכְתִּי", "הוּא הִזְמִין אוֹתִי לַמְּסִבָּה שֶׁלּוֹ, אֲבָל לֹא אֵלֵךְ", "הוּא הִזְמִין אוֹתִי בַּמְּסִבָּה שֶׁלּוֹ, אֲבָל לֹא הָלַכְתִּי"] },
    ],
  },
  // Level 20 (2026-11-12): real sentences: plans and opinions (future, want + infinitive, I think that..., participles).
  {
    id: "level-real-plans", english: "Real sentences: plans and opinions", hebrew: "מִשְׁפָּטִים אֲמִתִּיִּים: תָּכְנִיּוֹת וְדֵעוֹת",
    words: [
      // Short ones
      { english: "I think so", hint: "לַחְשֹׁב", hebrew: "אֲנִי חוֹשֵׁב שֶׁכֵּן", wrong: ["אֲנִי חוֹשֶׁבֶת שֶׁכֵּן", "אֲנִי חוֹשֵׁב שֶׁלֹּא", "חָשַׁבְתִּי שֶׁכֵּן"], f: { hebrew: "אֲנִי חוֹשֶׁבֶת שֶׁכֵּן", wrong: ["אֲנִי חוֹשֵׁב שֶׁכֵּן", "אֲנִי חוֹשֶׁבֶת שֶׁלֹּא", "חָשַׁבְתִּי שֶׁכֵּן"] } },
      { english: "we'll see", hint: "לִרְאוֹת", hebrew: "נִרְאֶה", wrong: ["רָאִינוּ", "אֶרְאֶה", "רוֹאִים"] },
      { english: "I'll tell her", hint: "לְהַגִּיד", hebrew: "אַגִּיד לָהּ", wrong: ["אַגִּיד אוֹתָהּ", "אַגִּיד לוֹ", "אָמַרְתִּי לָהּ"] },
      { english: "I'll see you (f.) there", hint: "לִרְאוֹת", hebrew: "אֶרְאֶה אוֹתָךְ שָׁם", wrong: ["אֶרְאֶה אַתְּ שָׁם", "אֶרְאֶה אוֹתְךָ שָׁם", "רָאִיתִי אוֹתָךְ שָׁם"] },
      { english: "everything is ready", hebrew: "הַכֹּל מוּכָן", wrong: ["הַכֹּל מוּכָנָה", "הַכֹּל מוּכָנִים", "הַכֹּל יִהְיֶה מוּכָן"] },
      // Full sentences
      { english: "tomorrow we will go to the beach with our friends", hint: "לָלֶכֶת", hebrew: "מָחָר נֵלֵךְ לַיָּם עִם הַחֲבֵרִים שֶׁלָּנוּ", wrong: ["מָחָר הָלַכְנוּ לַיָּם עִם הַחֲבֵרִים שֶׁלָּנוּ", "מָחָר אֵלֵךְ לַיָּם עִם הַחֲבֵרִים שֶׁלָּנוּ", "מָחָר נֵלֵךְ בַּיָּם עִם הַחֲבֵרִים שֶׁלָּנוּ"] },
      { english: "I think that the movie will be great", hint: "לַחְשֹׁב", hebrew: "אֲנִי חוֹשֵׁב שֶׁהַסֶּרֶט יִהְיֶה מְעֻלֶּה", wrong: ["אֲנִי חוֹשֵׁב כְּשֶׁהַסֶּרֶט יִהְיֶה מְעֻלֶּה", "אֲנִי חוֹשֵׁב שֶׁהַסֶּרֶט הָיָה מְעֻלֶּה", "אֲנִי חוֹשֶׁבֶת שֶׁהַסֶּרֶט יִהְיֶה מְעֻלֶּה"], f: { hebrew: "אֲנִי חוֹשֶׁבֶת שֶׁהַסֶּרֶט יִהְיֶה מְעֻלֶּה", wrong: ["אֲנִי חוֹשֶׁבֶת כְּשֶׁהַסֶּרֶט יִהְיֶה מְעֻלֶּה", "אֲנִי חוֹשֶׁבֶת שֶׁהַסֶּרֶט הָיָה מְעֻלֶּה", "אֲנִי חוֹשֵׁב שֶׁהַסֶּרֶט יִהְיֶה מְעֻלֶּה"] } },
      { english: "she says that the test is easy", hint: "לוֹמַר", hebrew: "הִיא אוֹמֶרֶת שֶׁהַמִּבְחָן קַל", wrong: ["הִיא אוֹמֵר שֶׁהַמִּבְחָן קַל", "הִיא אוֹמֶרֶת כְּשֶׁהַמִּבְחָן קַל", "הִיא אוֹמֶרֶת שֶׁהַמִּבְחָן קַלָּה"] },
      { english: "when I grow up, I want to be a doctor", hebrew: "כְּשֶׁאֶהְיֶה גָּדוֹל, אֲנִי רוֹצֶה לִהְיוֹת רוֹפֵא", wrong: ["כְּשֶׁהָיִיתִי גָּדוֹל, אֲנִי רוֹצֶה לִהְיוֹת רוֹפֵא", "כְּשֶׁאֶהְיֶה גָּדוֹל, אֲנִי רוֹצֶה אֶהְיֶה רוֹפֵא", "שֶׁאֶהְיֶה גָּדוֹל, אֲנִי רוֹצֶה לִהְיוֹת רוֹפֵא"], f: { hebrew: "כְּשֶׁאֶהְיֶה גְּדוֹלָה, אֲנִי רוֹצָה לִהְיוֹת רוֹפְאָה", wrong: ["כְּשֶׁהָיִיתִי גְּדוֹלָה, אֲנִי רוֹצָה לִהְיוֹת רוֹפְאָה", "כְּשֶׁאֶהְיֶה גְּדוֹלָה, אֲנִי רוֹצָה אֶהְיֶה רוֹפְאָה", "שֶׁאֶהְיֶה גְּדוֹלָה, אֲנִי רוֹצָה לִהְיוֹת רוֹפְאָה"] } },
      { english: "we will buy her a present", hint: "לִקְנוֹת", hebrew: "נִקְנֶה לָהּ מַתָּנָה", wrong: ["נִקְנֶה אוֹתָהּ מַתָּנָה", "קָנִינוּ לָהּ מַתָּנָה", "נִקְנֶה לוֹ מַתָּנָה"] },
      { english: "do you (f.) want to watch a movie with me tonight?", hebrew: "אַתְּ רוֹצָה לִרְאוֹת אִתִּי סֶרֶט הָעֶרֶב?", wrong: ["אַתְּ רוֹצָה לִרְאוֹת אוֹתִי סֶרֶט הָעֶרֶב?", "אַתְּ רוֹצֶה לִרְאוֹת אִתִּי סֶרֶט הָעֶרֶב?", "אַתְּ רוֹצָה רוֹאָה אִתִּי סֶרֶט הָעֶרֶב?"] },
      { english: "if it rains, we'll stay home", hint: "לְהִשָּׁאֵר", hebrew: "אִם יֵרֵד גֶּשֶׁם, נִשָּׁאֵר בַּבַּיִת", wrong: ["אִם יֵרֵד גֶּשֶׁם, נִשְׁאַרְנוּ בַּבַּיִת", "אִם יֵרֵד גֶּשֶׁם, נִשָּׁאֵר לַבַּיִת", "אִם יֵרֵד גֶּשֶׁם, אֶשָּׁאֵר בַּבַּיִת"] },
      { english: "I hope that you (m.) will come to the party", hint: "לְקַוּוֹת", hebrew: "אֲנִי מְקַוֶּה שֶׁתָּבוֹא לַמְּסִבָּה", wrong: ["אֲנִי מְקַוֶּה שֶׁתָּבוֹאִי לַמְּסִבָּה", "אֲנִי מְקַוֶּה שֶׁבָּאתָ לַמְּסִבָּה", "אֲנִי מְקַוָּה שֶׁתָּבוֹא לַמְּסִבָּה"], f: { hebrew: "אֲנִי מְקַוָּה שֶׁתָּבוֹא לַמְּסִבָּה", wrong: ["אֲנִי מְקַוָּה שֶׁתָּבוֹאִי לַמְּסִבָּה", "אֲנִי מְקַוָּה שֶׁבָּאתָ לַמְּסִבָּה", "אֲנִי מְקַוֶּה שֶׁתָּבוֹא לַמְּסִבָּה"] } },
      { english: "the museum is closed, so we'll go tomorrow", hint: "לָלֶכֶת", hebrew: "הַמּוּזֵאוֹן סָגוּר, אָז נֵלֵךְ מָחָר", wrong: ["הַמּוּזֵאוֹן סָגוּר, אָז אֵלֵךְ מָחָר", "הַמּוּזֵאוֹן סְגוּרָה, אָז נֵלֵךְ מָחָר", "הַמּוּזֵאוֹן סָגוּר, אָז הָלַכְנוּ מָחָר"] },
      { english: "in my opinion, the new book is better", hebrew: "לְדַעְתִּי, הַסֵּפֶר הֶחָדָשׁ יוֹתֵר טוֹב", wrong: ["לְדַעְתִּי, הַסֵּפֶר חָדָשׁ יוֹתֵר טוֹב", "לְדַעְתִּי, הַסֵּפֶר הֶחָדָשׁ יוֹתֵר טוֹבָה", "לְדַעְתּוֹ, הַסֵּפֶר הֶחָדָשׁ יוֹתֵר טוֹב"] },
      { english: "we will finish the project and send it to the teacher (f.)", hint: "לְסַיֵּם", hebrew: "נְסַיֵּם אֶת הַפְּרוֹיֶקְט וְנִשְׁלַח אוֹתוֹ לַמּוֹרָה", wrong: ["נְסַיֵּם הַפְּרוֹיֶקְט וְנִשְׁלַח אוֹתוֹ לַמּוֹרָה", "נְסַיֵּם אֶת הַפְּרוֹיֶקְט וְנִשְׁלַח אוֹתָהּ לַמּוֹרָה", "נְסַיֵּם אֶת הַפְּרוֹיֶקְט וְנִשְׁלַח אוֹתוֹ בַּמּוֹרָה"] },
      { english: "it's important to me that you (m.) understand me", hint: "לְהָבִין", hebrew: "חָשׁוּב לִי שֶׁתָּבִין אוֹתִי", wrong: ["חָשׁוּב לִי שֶׁתָּבִין אֲנִי", "חָשׁוּב לִי שֶׁתָּבִינִי אוֹתִי", "חָשׁוּב לִי שֶׁתָּבִין אוֹתְךָ"] },
    ],
  },
];

// ---------- Level names: A and B ----------
// Every level has an A part (its new words) and, from level 2 on, a B part.
// So the order is 1, 2A, 2B, 3A, 3B ... with review checkpoints (✅) in between.
// The numbers come from each level's place in the LEVELS list, so you can add a level
// in the middle and everything after it moves up by one by itself.
// Level 1 is just "1", because it has no B part.
// In Hebrew they're written with Hebrew letters: 3א, 3ב.
//
// ---------- B levels (2B, 3B ...) ----------
// Each B level has its OWN hand-written list in levels-b.js (LEVEL_B): sentences that
// combine that level's topic with earlier topics. When you play a B level, you get that
// whole list, plus a few random words from the level's A part and a few from earlier
// levels (how many: REVIEW_MIX in rules.js). The random part is picked again each time.
// (There's no 1B, because there's nothing before level 1 to combine with.)
//
// ---------- Review checkpoints (✅1, ✅2 ...) ----------
// Not real levels: they ask questions from EVERY level before them (A and B), spread
// evenly. Mastery is counted per word, so right answers in a checkpoint also count
// toward the mastery of the levels those words came from. Where they go: CHECKPOINTS below.

// Remember which level each word comes from (quiz.js uses this to borrow
// wrong answers from the word's OWN level, so a single word isn't next to sentences).
const homeLevelOf = new Map();
function rememberHome(words, home) {
  for (const word of words) {
    homeLevelOf.set(word, home);
    // A word with an f: part gets a ready-made feminine copy (same English and hint).
    if (word.f) {
      word.feminine = { ...word, ...word.f };
      homeLevelOf.set(word.feminine, home);
    }
  }
}
LEVELS.forEach((level, index) => {
  // Level 1 is just "1" (there's no 1B, so the "A" would be confusing).
  level.number = index === 0 ? "1" : (index + 1) + "A";     // shown in English, like "3A"
  level.numberHe = index === 0 ? "1" : (index + 1) + "א";   // shown in Hebrew, like "3א"
  rememberHome(level.words, level);
});

// The review checkpoints: each one comes right after the B part of this level.
const CHECKPOINTS = ["level-5", "level-10", "level-12", "level-participles", "level-real-plans"];

// DECKS = every level in order: 1, 2A, 2B, 3A, 3B ... with the checkpoints in between.
const DECKS = [];
const wordsSoFar = []; // one list per level so far (its A + B words), for the checkpoints
LEVELS.forEach((level, index) => {
  DECKS.push(level);
  const upTo = index + 1;
  let ownB = [];
  if (index > 0) {
    ownB = (typeof LEVEL_B !== "undefined" && LEVEL_B[level.id]) || [];
    const deckB = {
      // Named after its level's id ("level-11" → "review-11"), not its number, so the ids
      // never change when a level is added in the middle. (Saved Auto levels use these ids.)
      id: level.id.replace("level-", "review-"),
      number: upTo + "B",
      numberHe: upTo + "ב",
      english: `${level.english} + earlier topics`,
      hebrew: `${level.hebrew} + נוֹשְׂאִים קוֹדְמִים`,
      review: true,
      newLevel: level,                              // its A part (a few random A words get mixed in)
      earlier: wordsSoFar.flat(),                   // everything before it (a few get mixed in)
      // Its own sentences (for mastery). A level with no B list yet falls back to its A words.
      words: ownB.length ? ownB : level.words,
    };
    rememberHome(ownB, deckB);
    DECKS.push(deckB);
  }
  wordsSoFar.push([...level.words, ...ownB]);

  const checkpointNumber = CHECKPOINTS.indexOf(level.id) + 1; // 0 = no checkpoint here
  if (checkpointNumber > 0) {
    DECKS.push({
      id: "checkpoint-" + level.id.replace("level-", ""),
      number: "✅" + checkpointNumber,
      numberHe: "✅" + checkpointNumber,
      english: `Review checkpoint: levels 1–${upTo}`,
      hebrew: `נְקֻדַּת חֲזָרָה: רָמוֹת 1–${upTo}`,
      checkpoint: true,
      parts: wordsSoFar.map((part) => part),        // each earlier level's words, kept apart
      words: wordsSoFar.flat(),                     // all of them (for mastery)
    });
  }
});

// Shuffle a copy of a list (the original stays as it is).
function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// The questions for a B level: its own list + a few A words + a few earlier words.
function mixReviewWords(deck) {
  if (deck.words === deck.newLevel.words) {
    // (No hand-written list: the old way, A words + the same number of earlier words.)
    return [...deck.newLevel.words, ...shuffled(deck.earlier).slice(0, deck.newLevel.words.length)];
  }
  return [
    ...deck.words,
    ...shuffled(deck.newLevel.words).slice(0, REVIEW_MIX.fromThisLevel),
    ...shuffled(deck.earlier).slice(0, REVIEW_MIX.fromEarlier),
  ];
}

// The questions for a review checkpoint: CHECKPOINT_QUESTIONS words. Every level before it
// gets the same share (at least 1), and any spots left over are filled with random words.
function mixCheckpointWords(deck) {
  const each = Math.max(1, Math.floor(CHECKPOINT_QUESTIONS / deck.parts.length));
  const picked = [];
  const leftOver = [];
  for (const part of deck.parts) {
    const mixed = shuffled(part);
    picked.push(...mixed.slice(0, each));
    leftOver.push(...mixed.slice(each));
  }
  const missing = Math.max(0, CHECKPOINT_QUESTIONS - picked.length);
  return [...picked, ...shuffled(leftOver).slice(0, missing)];
}

// ---------- Premade decks (TOPIC_DECKS) ----------
// Ready-made decks for teachers. They're not part of the level ladder (Auto never
// picks them); the teacher picks one in a class game, under "Premade decks".
// Same format as the levels above (wrong answers, hint, f: for the feminine "I"/"we").
// Two kinds:
//   kind: "theme" → words and sentences for one place or situation (school, restaurant, trip).
//   kind: "root"  → one or two verb roots: the infinitive, the present tense, nouns made
//                   from the root, and sentences showing which word or prefix comes AFTER
//                   the verb. The same verb can take different ones with different meanings
//                   (מְדַבֵּר עִם = talks WITH, מְדַבֵּר עַל = talks ABOUT), so the wrong answers
//                   swap them around.
//   kind: "conj"  → one verb conjugated: all 8 people in the past, all 8 in the future,
//                   plus 2 sentences. (Made from a conjugation table, so the wrong answers
//                   follow a pattern: other tense, other gender, other person.)
//   kind: "tense" → a "Key concept" (past tense, future tense).
// icon = the emoji shown before the deck's name.
// pattern = the verb pattern (binyan) of a "root" or "conj" deck: "paal", "piel" …
//           (the list is VERB_PATTERNS, under TOPIC_DECKS). Each deck sticks to ONE
//           pattern, so a root with verbs in two patterns gets two decks (ל־מ־ד: learn / teach).
//           The dashboard and the lobby list root decks under a heading per pattern.
// The order here doesn't matter: sortPremadeDecks() puts them in order (see below).

// Helper for the newer conjugation decks: builds the 16 questions (8 past + 8 future)
// from a short table, so each verb is just two lines of Hebrew that are easy to check.
// The people are always in this order:
//   I, you (m.), you (f.), he, she, we, you all (m.), they
// The wrong answers follow the same pattern as the hand-written decks:
// the same person in the other tense, the other gender (or I <-> we), and another person.
const CONJ_PEOPLE = [
  { en: "I", he: "אֲנִי" },
  { en: "you (m.)", he: "אַתָּה" },
  { en: "you (f.)", he: "אַתְּ" },
  { en: "he", he: "הוּא" },
  { en: "she", he: "הִיא" },
  { en: "we", he: "אֲנַחְנוּ" },
  { en: "you all (m.)", he: "אַתֶּם" },
  { en: "they", he: "הֵם" },
];
const CONJ_SWAP = [5, 2, 1, 4, 3, 0, 7, 6];  // the other gender (or I <-> we)
const CONJ_OTHER = [3, 0, 5, 0, 2, 7, 1, 3]; // another person
function conjWords(hint, pastEn, futureEn, past, future) {
  const words = [];
  for (const [forms, otherTense, english] of [[past, future, pastEn], [future, past, "will " + futureEn]]) {
    forms.forEach((form, i) => {
      const who = CONJ_PEOPLE[i];
      words.push({
        english: who.en + " " + english,
        hint,
        hebrew: who.he + " " + form,
        wrong: [otherTense[i], forms[CONJ_SWAP[i]], forms[CONJ_OTHER[i]]].map(f => who.he + " " + f),
      });
    });
  }
  return words;
}

const TOPIC_DECKS = [
  // ===== Theme decks =====
  {
    id: "theme-school", kind: "theme", icon: "🏫", english: "School", hebrew: "בֵּית סֵפֶר",
    words: [
      { english: "school", hebrew: "בֵּית סֵפֶר", wrong: ["כִּתָּה", "סֵפֶר", "בַּיִת"] },
      { english: "class, classroom", hebrew: "כִּתָּה", wrong: ["שִׁעוּר", "בֵּית סֵפֶר", "לוּחַ"] },
      { english: "teacher (m.)", hebrew: "מוֹרֶה", wrong: ["מוֹרָה", "תַּלְמִיד", "מוֹרִים"] },
      { english: "teacher (f.)", hebrew: "מוֹרָה", wrong: ["מוֹרֶה", "תַּלְמִידָה", "מוֹרוֹת"] },
      { english: "student (m.)", hebrew: "תַּלְמִיד", wrong: ["תַּלְמִידָה", "מוֹרֶה", "תַּלְמִידִים"] },
      { english: "student (f.)", hebrew: "תַּלְמִידָה", wrong: ["תַּלְמִיד", "מוֹרָה", "תַּלְמִידוֹת"] },
      { english: "lesson", hebrew: "שִׁעוּר", wrong: ["מִבְחָן", "כִּתָּה", "הַפְסָקָה"] },
      { english: "homework", hebrew: "שִׁעוּרֵי בַּיִת", wrong: ["שִׁעוּר", "בֵּית סֵפֶר", "מִבְחָן"] },
      { english: "test", hebrew: "מִבְחָן", wrong: ["שִׁעוּר", "מַחְבֶּרֶת", "הַפְסָקָה"] },
      { english: "recess, break", hebrew: "הַפְסָקָה", wrong: ["שִׁעוּר", "מִבְחָן", "כִּתָּה"] },
      { english: "notebook", hebrew: "מַחְבֶּרֶת", wrong: ["סֵפֶר", "עִפָּרוֹן", "תִּיק"] },
      { english: "pencil", hebrew: "עִפָּרוֹן", wrong: ["עֵט", "מַחְבֶּרֶת", "לוּחַ"] },
      { english: "pen", hebrew: "עֵט", wrong: ["עִפָּרוֹן", "תִּיק", "סֵפֶר"] },
      { english: "board (in class)", hebrew: "לוּחַ", wrong: ["שֻׁלְחָן", "כִּתָּה", "עֵט"] },
      { english: "bag, schoolbag", hebrew: "תִּיק", wrong: ["סֵפֶר", "מַחְבֶּרֶת", "לוּחַ"] },
      { english: "the students sit in the classroom", hint: "לָשֶׁבֶת", hebrew: "הַתַּלְמִידִים יוֹשְׁבִים בַּכִּתָּה", wrong: ["הַתַּלְמִידִים יוֹשְׁבִים לַכִּתָּה", "הַתַּלְמִידִים יוֹשְׁבִים מֵהַכִּתָּה", "הַתַּלְמִידִים יוֹשֵׁב בַּכִּתָּה"] },
      { english: "the teacher (f.) writes on the board", hint: "לִכְתֹּב", hebrew: "הַמּוֹרָה כּוֹתֶבֶת עַל הַלּוּחַ", wrong: ["הַמּוֹרָה כּוֹתֶבֶת לַלּוּחַ", "הַמּוֹרָה כּוֹתֵב עַל הַלּוּחַ", "הַמּוֹרָה כּוֹתֶבֶת אֶת הַלּוּחַ"] },
      { english: "she asks the teacher (m.) a question", hint: "לִשְׁאֹל", hebrew: "הִיא שׁוֹאֶלֶת אֶת הַמּוֹרֶה שְׁאֵלָה", wrong: ["הִיא שׁוֹאֶלֶת לַמּוֹרֶה שְׁאֵלָה", "הִיא שׁוֹאֶלֶת עִם הַמּוֹרֶה שְׁאֵלָה", "הוּא שׁוֹאֵל אֶת הַמּוֹרֶה שְׁאֵלָה"] },
      { english: "he forgot the homework", hint: "לִשְׁכֹּחַ", hebrew: "הוּא שָׁכַח אֶת שִׁעוּרֵי הַבַּיִת", wrong: ["הוּא שָׁכַח שִׁעוּרֵי הַבַּיִת", "הִיא שָׁכְחָה אֶת שִׁעוּרֵי הַבַּיִת", "הוּא שׁוֹכֵחַ אֶת שִׁעוּרֵי הַבַּיִת"] },
      { english: "the students go out to recess", hint: "לָצֵאת", hebrew: "הַתַּלְמִידִים יוֹצְאִים לַהַפְסָקָה", wrong: ["הַתַּלְמִידִים יוֹצְאִים מֵהַהַפְסָקָה", "הַתַּלְמִידִים יוֹצֵא לַהַפְסָקָה", "הַתַּלְמִידִים נִכְנָסִים לַהַפְסָקָה"] },
      { english: "tomorrow there is a test", hebrew: "מָחָר יֵשׁ מִבְחָן", wrong: ["מָחָר אֵין מִבְחָן", "אֶתְמוֹל הָיָה מִבְחָן", "מָחָר יֵשׁ שִׁעוּר"] },
      { english: "can I go to the bathroom?", hint: "לָלֶכֶת", hebrew: "אֶפְשָׁר לָלֶכֶת לַשֵּׁרוּתִים?", wrong: ["אֶפְשָׁר לָלֶכֶת בַּשֵּׁרוּתִים?", "אֶפְשָׁר הוֹלֵךְ לַשֵּׁרוּתִים?", "אֶפְשָׁר לָלֶכֶת מֵהַשֵּׁרוּתִים?"] },
    ],
  },
  {
    id: "theme-restaurant", kind: "theme", icon: "🍽️", english: "Restaurant", hebrew: "מִסְעָדָה",
    words: [
      { english: "restaurant", hebrew: "מִסְעָדָה", wrong: ["מֶלְצַר", "תַּפְרִיט", "מִטְבָּח"] },
      { english: "waiter", hebrew: "מֶלְצַר", wrong: ["מֶלְצָרִית", "מִסְעָדָה", "טַבָּח"] },
      { english: "waitress", hebrew: "מֶלְצָרִית", wrong: ["מֶלְצַר", "מוֹרָה", "מֶלְצָרִים"] },
      { english: "menu", hebrew: "תַּפְרִיט", wrong: ["חֶשְׁבּוֹן", "צַלַּחַת", "שֻׁלְחָן"] },
      { english: "the check, the bill", hebrew: "חֶשְׁבּוֹן", wrong: ["תַּפְרִיט", "טִיפּ", "כֶּסֶף"] },
      { english: "table", hebrew: "שֻׁלְחָן", wrong: ["כִּסֵּא", "צַלַּחַת", "תַּפְרִיט"] },
      { english: "plate", hebrew: "צַלַּחַת", wrong: ["כּוֹס", "כַּף", "שֻׁלְחָן"] },
      { english: "glass, cup", hebrew: "כּוֹס", wrong: ["כַּף", "צַלַּחַת", "בַּקְבּוּק"] },
      { english: "fork", hebrew: "מַזְלֵג", wrong: ["סַכִּין", "כַּף", "צַלַּחַת"] },
      { english: "knife", hebrew: "סַכִּין", wrong: ["מַזְלֵג", "כַּף", "כּוֹס"] },
      { english: "spoon", hebrew: "כַּף", wrong: ["כּוֹס", "מַזְלֵג", "סַכִּין"] },
      { english: "water", hebrew: "מַיִם", wrong: ["יַיִן", "מִיץ", "יָם"] },
      { english: "dessert", hebrew: "קִנּוּחַ", wrong: ["סָלָט", "מָנָה", "חֶשְׁבּוֹן"] },
      { english: "salad", hebrew: "סָלָט", wrong: ["קִנּוּחַ", "לֶחֶם", "מָרָק"] },
      { english: "a table for four, please", hebrew: "שֻׁלְחָן לְאַרְבָּעָה, בְּבַקָּשָׁה", wrong: ["שֻׁלְחָן בְּאַרְבָּעָה, בְּבַקָּשָׁה", "שֻׁלְחָן מֵאַרְבָּעָה, בְּבַקָּשָׁה", "שֻׁלְחָן לִשְׁלוֹשָׁה, בְּבַקָּשָׁה"] },
      { english: "can I get the menu?", hint: "לְקַבֵּל", hebrew: "אֶפְשָׁר לְקַבֵּל אֶת הַתַּפְרִיט?", wrong: ["אֶפְשָׁר לְקַבֵּל הַתַּפְרִיט?", "אֶפְשָׁר מְקַבֵּל אֶת הַתַּפְרִיט?", "אֶפְשָׁר לְקַבֵּל אֶת תַּפְרִיט?"] },
      { english: "she orders a salad", hint: "לְהַזְמִין", hebrew: "הִיא מַזְמִינָה סָלָט", wrong: ["הִיא מַזְמִין סָלָט", "הִיא מַזְמִינָה אֶת סָלָט", "הִיא מַזְמִינָה לְסָלָט"] },
      { english: "the waiter brings water to the table", hint: "לְהָבִיא", hebrew: "הַמֶּלְצַר מֵבִיא מַיִם לַשֻּׁלְחָן", wrong: ["הַמֶּלְצַר מֵבִיא מַיִם בַּשֻּׁלְחָן", "הַמֶּלְצַר מֵבִיא מַיִם מֵהַשֻּׁלְחָן", "הַמֶּלְצָרִית מֵבִיא מַיִם לַשֻּׁלְחָן"] },
      { english: "they (m.) are waiting for the food", hint: "לְחַכּוֹת", hebrew: "הֵם מְחַכִּים לָאֹכֶל", wrong: ["הֵם מְחַכִּים אֶת הָאֹכֶל", "הֵם מְחַכִּים בָּאֹכֶל", "הֵם מְחַכֶּה לָאֹכֶל"] },
      { english: "the food is very tasty", hebrew: "הָאֹכֶל טָעִים מְאוֹד", wrong: ["הָאֹכֶל טְעִימָה מְאוֹד", "הָאֹכֶל טְעִימִים מְאוֹד", "הָאֹכֶל רָעֵב מְאוֹד"] },
      { english: "he eats with a fork", hint: "לֶאֱכֹל", hebrew: "הוּא אוֹכֵל בְּמַזְלֵג", wrong: ["הוּא אוֹכֵל לְמַזְלֵג", "הוּא אוֹכֵל אֶת הַמַּזְלֵג", "הִיא אוֹכֶלֶת בְּמַזְלֵג"] },
      { english: "the check, please", hebrew: "הַחֶשְׁבּוֹן, בְּבַקָּשָׁה", wrong: ["הַתַּפְרִיט, בְּבַקָּשָׁה", "הַשֻּׁלְחָן, בְּבַקָּשָׁה", "הַחֶשְׁבּוֹן, תּוֹדָה"] },
    ],
  },
  {
    id: "theme-trip", kind: "theme", icon: "🎒", english: "Trip (tiyul)", hebrew: "טִיּוּל",
    words: [
      { english: "trip, hike", hebrew: "טִיּוּל", wrong: ["שְׁבִיל", "הַר", "מַדְרִיךְ"] },
      { english: "backpack", hebrew: "תַּרְמִיל", wrong: ["תִּיק", "בַּקְבּוּק", "כּוֹבַע"] },
      { english: "water bottle", hebrew: "בַּקְבּוּק מַיִם", wrong: ["כּוֹס מַיִם", "בַּקְבּוּק", "מַיִם"] },
      { english: "hat", hebrew: "כּוֹבַע", wrong: ["תַּרְמִיל", "מַפָּה", "נַעַל"] },
      { english: "map", hebrew: "מַפָּה", wrong: ["שְׁבִיל", "מַדְרִיךְ", "כּוֹבַע"] },
      { english: "trail, path", hebrew: "שְׁבִיל", wrong: ["כְּבִישׁ", "נַחַל", "מַפָּה"] },
      { english: "mountain", hebrew: "הַר", wrong: ["נַחַל", "מְעָרָה", "יָם"] },
      { english: "stream", hebrew: "נַחַל", wrong: ["יָם", "הַר", "שְׁבִיל"] },
      { english: "cave", hebrew: "מְעָרָה", wrong: ["הַר", "נַחַל", "מַפָּה"] },
      { english: "view, landscape", hebrew: "נוֹף", wrong: ["הַר", "שֶׁמֶשׁ", "שְׁבִיל"] },
      { english: "guide (m.)", hebrew: "מַדְרִיךְ", wrong: ["מַדְרִיכָה", "מוֹרֶה", "מַפָּה"] },
      { english: "guide (f.)", hebrew: "מַדְרִיכָה", wrong: ["מַדְרִיךְ", "מוֹרָה", "מַדְרִיכִים"] },
      { english: "sunscreen", hebrew: "קֶרֶם הֲגָנָה", wrong: ["כּוֹבַע", "שֶׁמֶשׁ", "קֶרֶם"] },
      { english: "bus", hebrew: "אוֹטוֹבּוּס", wrong: ["מְכוֹנִית", "תַּחֲנָה", "רַכֶּבֶת"] },
      { english: "the class is going out on a trip", hint: "לָצֵאת", hebrew: "הַכִּתָּה יוֹצֵאת לְטִיּוּל", wrong: ["הַכִּתָּה יוֹצֵאת מִטִּיּוּל", "הַכִּתָּה יוֹצֵא לְטִיּוּל", "הַכִּתָּה יוֹצֵאת אֶת טִיּוּל"] },
      { english: "the bus leaves at eight", hint: "לָצֵאת", hebrew: "הָאוֹטוֹבּוּס יוֹצֵא בִּשְׁמוֹנֶה", wrong: ["הָאוֹטוֹבּוּס יוֹצֵא לִשְׁמוֹנֶה", "הָאוֹטוֹבּוּס יוֹצֵאת בִּשְׁמוֹנֶה", "הָאוֹטוֹבּוּס יוֹצֵא מִשְּׁמוֹנֶה"] },
      { english: "you need to drink water", hint: "לִשְׁתּוֹת", hebrew: "צָרִיךְ לִשְׁתּוֹת מַיִם", wrong: ["צָרִיךְ שׁוֹתֶה מַיִם", "צָרִיךְ לֶאֱכֹל מַיִם", "צָרִיךְ לִשְׁתּוֹת לְמַיִם"] },
      { english: "she puts the bottle in the backpack", hint: "לָשִׂים", hebrew: "הִיא שָׂמָה אֶת הַבַּקְבּוּק בַּתַּרְמִיל", wrong: ["הִיא שָׂמָה הַבַּקְבּוּק בַּתַּרְמִיל", "הִיא שָׂמָה אֶת הַבַּקְבּוּק מֵהַתַּרְמִיל", "הוּא שָׂמָה אֶת הַבַּקְבּוּק בַּתַּרְמִיל"] },
      { english: "they (m.) climb the mountain", hint: "לְטַפֵּס", hebrew: "הֵם מְטַפְּסִים עַל הָהָר", wrong: ["הֵם מְטַפְּסִים אֶת הָהָר", "הֵם מְטַפֵּס עַל הָהָר", "הֵם מְטַפְּסִים מֵהָהָר"] },
      { english: "the guide (f.) walks on the trail", hint: "לָלֶכֶת", hebrew: "הַמַּדְרִיכָה הוֹלֶכֶת בַּשְּׁבִיל", wrong: ["הַמַּדְרִיכָה הוֹלֵךְ בַּשְּׁבִיל", "הַמַּדְרִיךְ הוֹלֶכֶת בַּשְּׁבִיל", "הַמַּדְרִיכָה הוֹלֶכֶת אֶת הַשְּׁבִיל"] },
      { english: "they (f.) walk in the stream", hint: "לָלֶכֶת", hebrew: "הֵן הוֹלְכוֹת בַּנַּחַל", wrong: ["הֵן הוֹלְכִים בַּנַּחַל", "הֵן הוֹלְכוֹת אֶת הַנַּחַל", "הֵם הוֹלְכוֹת בַּנַּחַל"] },
      { english: "there's a beautiful view from here", hebrew: "יֵשׁ נוֹף יָפֶה מִכָּאן", wrong: ["יֵשׁ נוֹף יָפָה מִכָּאן", "יֵשׁ נוֹף יָפֶה בְּכָאן", "אֵין נוֹף יָפֶה מִכָּאן"] },
    ],
  },
  // ===== Key concepts (2026-11-12): one big grammar idea, many verbs. More concepts can be added here later. =====
  {
    id: "tense-past", kind: "tense", icon: "⏪", english: "Key concept: past tense", hebrew: "מֻשָּׂג מַפְתֵּחַ: עָבָר",
    words: [
      { english: "I wrote", hint: "לִכְתֹּב", hebrew: "אֲנִי כָּתַבְתִּי", wrong: ["אֲנִי אֶכְתֹּב", "אֲנִי כָּתַבְנוּ", "אֲנִי כָּתַב"] },
      { english: "you (m.) ate", hint: "לֶאֱכֹל", hebrew: "אַתָּה אָכַלְתָּ", wrong: ["אַתָּה תֹּאכַל", "אַתָּה אָכַלְתְּ", "אַתָּה אָכַלְתִּי"] },
      { english: "you (f.) spoke", hint: "לְדַבֵּר", hebrew: "אַתְּ דִּבַּרְתְּ", wrong: ["אַתְּ תְּדַבְּרִי", "אַתְּ דִּבַּרְתָּ", "אַתְּ דִּבַּרְנוּ"] },
      { english: "he started", hint: "לְהַתְחִיל", hebrew: "הוּא הִתְחִיל", wrong: ["הוּא יַתְחִיל", "הוּא הִתְחִילָה", "הוּא הִתְחַלְתִּי"] },
      { english: "she bought", hint: "לִקְנוֹת", hebrew: "הִיא קָנְתָה", wrong: ["הִיא תִּקְנֶה", "הִיא קָנָה", "הִיא קָנִית"] },
      { english: "we got dressed", hint: "לְהִתְלַבֵּשׁ", hebrew: "אֲנַחְנוּ הִתְלַבַּשְׁנוּ", wrong: ["אֲנַחְנוּ נִתְלַבֵּשׁ", "אֲנַחְנוּ הִתְלַבַּשְׁתִּי", "אֲנַחְנוּ הִתְלַבְּשׁוּ"] },
      { english: "you all (m.) traveled", hint: "לִנְסֹעַ", hebrew: "אַתֶּם נְסַעְתֶּם", wrong: ["אַתֶּם תִּסְעוּ", "אַתֶּם נָסְעוּ", "אַתֶּם נָסַעְתָּ"] },
      { english: "they (m.) sang", hint: "לָשִׁיר", hebrew: "הֵם שָׁרוּ", wrong: ["הֵם יָשִׁירוּ", "הֵם שַׁרְתֶּם", "הֵם שָׁר"] },
      { english: "I got up", hint: "לָקוּם", hebrew: "אֲנִי קַמְתִּי", wrong: ["אֲנִי אָקוּם", "אֲנִי קַמְנוּ", "אֲנִי קָם"] },
      { english: "you (m.) understood", hint: "לְהָבִין", hebrew: "אַתָּה הֵבַנְתָּ", wrong: ["אַתָּה תָּבִין", "אַתָּה הֵבַנְתְּ", "אַתָּה הֵבַנְתִּי"] },
      { english: "you (f.) invited", hint: "לְהַזְמִין", hebrew: "אַתְּ הִזְמַנְתְּ", wrong: ["אַתְּ תַּזְמִינִי", "אַתְּ הִזְמַנְתָּ", "אַתְּ הִזְמִינָה"] },
      { english: "he gave", hint: "לָתֵת", hebrew: "הוּא נָתַן", wrong: ["הוּא יִתֵּן", "הוּא נָתְנָה", "הוּא נָתַתִּי"] },
      { english: "she played", hint: "לְשַׂחֵק", hebrew: "הִיא שִׂחֲקָה", wrong: ["הִיא תְּשַׂחֵק", "הִיא שִׂחֵק", "הִיא שִׂחַקְתְּ"] },
      { english: "we came", hint: "לָבוֹא", hebrew: "אֲנַחְנוּ בָּאנוּ", wrong: ["אֲנַחְנוּ נָבוֹא", "אֲנַחְנוּ בָּאתִי", "אֲנַחְנוּ בָּאוּ"] },
      { english: "you all (m.) said", hint: "לְהַגִּיד", hebrew: "אַתֶּם אֲמַרְתֶּם", wrong: ["אַתֶּם תַּגִּידוּ", "אַתֶּם אָמְרוּ", "אַתֶּם אָמַרְתָּ"] },
      { english: "they (f.) saw", hint: "לִרְאוֹת", hebrew: "הֵן רָאוּ", wrong: ["הֵן יִרְאוּ", "הֵן רָאֲתָה", "הֵן רָאִינוּ"] },
      { english: "she told", hint: "לְסַפֵּר", hebrew: "הִיא סִפְּרָה", wrong: ["הִיא תְּסַפֵּר", "הִיא סִפֵּר", "הִיא סִפַּרְתְּ"] },
      { english: "you (f.) drank", hint: "לִשְׁתּוֹת", hebrew: "אַתְּ שָׁתִית", wrong: ["אַתְּ תִּשְׁתִּי", "אַתְּ שָׁתִיתָ", "אַתְּ שָׁתִינוּ"] },
      { english: "I wrote a letter to Dana", hint: "לִכְתֹּב", hebrew: "כָּתַבְתִּי מִכְתָּב לְדָנָה", wrong: ["אֶכְתֹּב מִכְתָּב לְדָנָה", "כָּתַבְתִּי אֶת מִכְתָּב לְדָנָה", "כָּתַבְנוּ מִכְתָּב לְדָנָה"] },
      { english: "yesterday we ate the pizza", hint: "לֶאֱכֹל", hebrew: "אֶתְמוֹל אָכַלְנוּ אֶת הַפִּיצָה", wrong: ["אֶתְמוֹל נֹאכַל אֶת הַפִּיצָה", "אֶתְמוֹל אָכַלְנוּ הַפִּיצָה", "אֶתְמוֹל אָכְלוּ אֶת הַפִּיצָה"] },
      { english: "she spoke with her mother", hint: "לְדַבֵּר", hebrew: "הִיא דִּבְּרָה עִם אִמָּא שֶׁלָּהּ", wrong: ["הִיא תְּדַבֵּר עִם אִמָּא שֶׁלָּהּ", "הִיא דִּבֵּר עִם אִמָּא שֶׁלָּהּ", "הִיא דִּבְּרָה אֶת אִמָּא שֶׁלָּהּ"] },
      { english: "he told me a story", hint: "לְסַפֵּר", hebrew: "הוּא סִפֵּר לִי סִפּוּר", wrong: ["הוּא יְסַפֵּר לִי סִפּוּר", "הוּא סִפֵּר אוֹתִי סִפּוּר", "הוּא סִפְּרָה לִי סִפּוּר"] },
      { english: "you (m.) said thank you", hint: "לְהַגִּיד", hebrew: "אַתָּה אָמַרְתָּ תּוֹדָה", wrong: ["אַתָּה תַּגִּיד תּוֹדָה", "אַתָּה אָמַרְתְּ תּוֹדָה", "אַתָּה אָמַר תּוֹדָה"] },
      { english: "what did you (f.) say?", hint: "לְהַגִּיד", hebrew: "מָה אָמַרְתְּ?", wrong: ["מָה תַּגִּידִי?", "מָה אָמַרְתָּ?", "מָה אָמַרְנוּ?"] },
      { english: "the movie started at eight", hint: "לְהַתְחִיל", hebrew: "הַסֶּרֶט הִתְחִיל בִּשְׁמוֹנֶה", wrong: ["הַסֶּרֶט יַתְחִיל בִּשְׁמוֹנֶה", "הַסֶּרֶט הִתְחִילָה בִּשְׁמוֹנֶה", "הַסֶּרֶט הִתְחִיל לִשְׁמוֹנֶה"] },
      { english: "we started the game", hint: "לְהַתְחִיל", hebrew: "הִתְחַלְנוּ אֶת הַמִּשְׂחָק", wrong: ["נַתְחִיל אֶת הַמִּשְׂחָק", "הִתְחַלְנוּ הַמִּשְׂחָק", "הִתְחַלְתִּי אֶת הַמִּשְׂחָק"] },
      { english: "this morning I got dressed quickly", hint: "לְהִתְלַבֵּשׁ", hebrew: "הַבֹּקֶר הִתְלַבַּשְׁתִּי מַהֵר", wrong: ["הַבֹּקֶר אֶתְלַבֵּשׁ מַהֵר", "הַבֹּקֶר הִתְלַבַּשְׁנוּ מַהֵר", "הַבֹּקֶר הִתְלַבֵּשׁ מַהֵר"] },
      { english: "they (f.) got dressed for the party", hint: "לְהִתְלַבֵּשׁ", hebrew: "הֵן הִתְלַבְּשׁוּ לַמְּסִבָּה", wrong: ["הֵן יִתְלַבְּשׁוּ לַמְּסִבָּה", "הֵן הִתְלַבְּשָׁה לַמְּסִבָּה", "הֵן הִתְלַבְּשׁוּ אֶת הַמְּסִבָּה"] },
      { english: "you (f.) bought a new dress", hint: "לִקְנוֹת", hebrew: "אַתְּ קָנִית שִׂמְלָה חֲדָשָׁה", wrong: ["אַתְּ תִּקְנִי שִׂמְלָה חֲדָשָׁה", "אַתְּ קָנִיתָ שִׂמְלָה חֲדָשָׁה", "אַתְּ קָנִית אֶת שִׂמְלָה חֲדָשָׁה"] },
      { english: "they (m.) bought the tickets", hint: "לִקְנוֹת", hebrew: "הֵם קָנוּ אֶת הַכַּרְטִיסִים", wrong: ["הֵם יִקְנוּ אֶת הַכַּרְטִיסִים", "הֵם קָנוּ הַכַּרְטִיסִים", "הֵם קָנָה אֶת הַכַּרְטִיסִים"] },
      { english: "last week I saw her", hint: "לִרְאוֹת", hebrew: "בַּשָּׁבוּעַ שֶׁעָבַר רָאִיתִי אוֹתָהּ", wrong: ["בַּשָּׁבוּעַ שֶׁעָבַר אֶרְאֶה אוֹתָהּ", "בַּשָּׁבוּעַ שֶׁעָבַר רָאִיתִי אֶת הִיא", "בַּשָּׁבוּעַ שֶׁעָבַר רָאִיתִי אוֹתוֹ"] },
      { english: "you all (m.) saw the game", hint: "לִרְאוֹת", hebrew: "רְאִיתֶם אֶת הַמִּשְׂחָק", wrong: ["תִּרְאוּ אֶת הַמִּשְׂחָק", "רְאִיתֶם הַמִּשְׂחָק", "רָאִינוּ אֶת הַמִּשְׂחָק"] },
      { english: "yesterday I got up at seven", hint: "לָקוּם", hebrew: "אֶתְמוֹל קַמְתִּי בְּשֶׁבַע", wrong: ["אֶתְמוֹל אָקוּם בְּשֶׁבַע", "אֶתְמוֹל קַמְנוּ בְּשֶׁבַע", "אֶתְמוֹל קָמָה בְּשֶׁבַע"] },
      { english: "she got up late", hint: "לָקוּם", hebrew: "הִיא קָמָה מְאֻחָר", wrong: ["הִיא תָּקוּם מְאֻחָר", "הִיא קָם מְאֻחָר", "הִיא קַמְתְּ מְאֻחָר"] },
      { english: "he came to school by bus", hint: "לָבוֹא", hebrew: "הוּא בָּא לְבֵית הַסֵּפֶר בָּאוֹטוֹבּוּס", wrong: ["הוּא יָבוֹא לְבֵית הַסֵּפֶר בָּאוֹטוֹבּוּס", "הוּא בָּאָה לְבֵית הַסֵּפֶר בָּאוֹטוֹבּוּס", "הוּא בָּא בְּבֵית הַסֵּפֶר בָּאוֹטוֹבּוּס"] },
      { english: "you (m.) came home late", hint: "לָבוֹא", hebrew: "אַתָּה בָּאתָ הַבַּיְתָה מְאֻחָר", wrong: ["אַתָּה תָּבוֹא הַבַּיְתָה מְאֻחָר", "אַתָּה בָּאת הַבַּיְתָה מְאֻחָר", "אַתָּה בָּאתָ בַּבַּיִת מְאֻחָר"] },
      { english: "we sang a song at the party", hint: "לָשִׁיר", hebrew: "שַׁרְנוּ שִׁיר בַּמְּסִבָּה", wrong: ["נָשִׁיר שִׁיר בַּמְּסִבָּה", "שַׁרְתִּי שִׁיר בַּמְּסִבָּה", "שַׁרְנוּ אֶת שִׁיר בַּמְּסִבָּה"] },
      { english: "I gave him the book", hint: "לָתֵת", hebrew: "נָתַתִּי לוֹ אֶת הַסֵּפֶר", wrong: ["אֶתֵּן לוֹ אֶת הַסֵּפֶר", "נָתַתִּי אוֹתוֹ אֶת הַסֵּפֶר", "נָתַתִּי לוֹ הַסֵּפֶר"] },
      { english: "she gave us a present", hint: "לָתֵת", hebrew: "הִיא נָתְנָה לָנוּ מַתָּנָה", wrong: ["הִיא תִּתֵּן לָנוּ מַתָּנָה", "הִיא נָתַן לָנוּ מַתָּנָה", "הִיא נָתְנָה אוֹתָנוּ מַתָּנָה"] },
      { english: "last year we traveled to Eilat", hint: "לִנְסֹעַ", hebrew: "בַּשָּׁנָה שֶׁעָבְרָה נָסַעְנוּ לְאֵילַת", wrong: ["בַּשָּׁנָה שֶׁעָבְרָה נִסַּע לְאֵילַת", "בַּשָּׁנָה שֶׁעָבְרָה נָסְעוּ לְאֵילַת", "בַּשָּׁנָה שֶׁעָבְרָה נָסַעְנוּ בְּאֵילַת"] },
      { english: "you (f.) traveled by train", hint: "לִנְסֹעַ", hebrew: "אַתְּ נָסַעְתְּ בָּרַכֶּבֶת", wrong: ["אַתְּ תִּסְעִי בָּרַכֶּבֶת", "אַתְּ נָסַעְתָּ בָּרַכֶּבֶת", "אַתְּ נָסַעְתְּ לָרַכֶּבֶת"] },
      { english: "I didn't understand the question", hint: "לְהָבִין", hebrew: "לֹא הֵבַנְתִּי אֶת הַשְּׁאֵלָה", wrong: ["לֹא אָבִין אֶת הַשְּׁאֵלָה", "לֹא הֵבַנְתִּי הַשְּׁאֵלָה", "לֹא הֵבַנּוּ אֶת הַשְּׁאֵלָה"] },
      { english: "they (m.) understood him", hint: "לְהָבִין", hebrew: "הֵם הֵבִינוּ אוֹתוֹ", wrong: ["הֵם יָבִינוּ אוֹתוֹ", "הֵם הֵבִינוּ אֶת הוּא", "הֵם הֵבִינוּ אוֹתָהּ"] },
      { english: "he invited me to the party", hint: "לְהַזְמִין", hebrew: "הוּא הִזְמִין אוֹתִי לַמְּסִבָּה", wrong: ["הוּא יַזְמִין אוֹתִי לַמְּסִבָּה", "הוּא הִזְמִינָה אוֹתִי לַמְּסִבָּה", "הוּא הִזְמִין אוֹתָהּ לַמְּסִבָּה"] },
      { english: "we invited them (f.)", hint: "לְהַזְמִין", hebrew: "הִזְמַנּוּ אוֹתָן", wrong: ["נַזְמִין אוֹתָן", "הִזְמַנּוּ אוֹתָם", "הִזְמַנּוּ אֶת הֵן"] },
      { english: "they (m.) played soccer", hint: "לְשַׂחֵק", hebrew: "הֵם שִׂחֲקוּ כַּדּוּרֶגֶל", wrong: ["הֵם יְשַׂחֲקוּ כַּדּוּרֶגֶל", "הֵם שִׂחֵק כַּדּוּרֶגֶל", "הֵם שִׂחַקְתֶּם כַּדּוּרֶגֶל"] },
      { english: "he drank all the water", hint: "לִשְׁתּוֹת", hebrew: "הוּא שָׁתָה אֶת כָּל הַמַּיִם", wrong: ["הוּא יִשְׁתֶּה אֶת כָּל הַמַּיִם", "הוּא שָׁתָה כָּל הַמַּיִם", "הוּא שָׁתְתָה אֶת כָּל הַמַּיִם"] },
      { english: "you (m.) did the homework", hint: "לַעֲשׂוֹת", hebrew: "עָשִׂיתָ אֶת שִׁעוּרֵי הַבַּיִת", wrong: ["תַּעֲשֶׂה אֶת שִׁעוּרֵי הַבַּיִת", "עָשִׂית אֶת שִׁעוּרֵי הַבַּיִת", "עָשִׂיתָ שִׁעוּרֵי הַבַּיִת"] },
      // ----- More practice (2026-11-12) -----
      // --- more short forms: new verbs, all persons ---
      { english: "I sat", hint: "לָשֶׁבֶת", hebrew: "אֲנִי יָשַׁבְתִּי", wrong: ["אֲנִי אֵשֵׁב", "אֲנִי יָשַׁבְנוּ", "אֲנִי יָשַׁב"] },
      { english: "you (m.) went out", hint: "לָצֵאת", hebrew: "אַתָּה יָצָאתָ", wrong: ["אַתָּה תֵּצֵא", "אַתָּה יָצָאת", "אַתָּה יָצָאתִי"] },
      { english: "she went out", hint: "לָצֵאת", hebrew: "הִיא יָצְאָה", wrong: ["הִיא תֵּצֵא", "הִיא יָצָא", "הִיא יָצָאת"] },
      { english: "you (f.) took", hint: "לָקַחַת", hebrew: "אַתְּ לָקַחַתְּ", wrong: ["אַתְּ תִּקְחִי", "אַתְּ לָקַחְתָּ", "אַתְּ לָקְחָה"] },
      { english: "he met", hint: "לִפְגֹּשׁ", hebrew: "הוּא פָּגַשׁ", wrong: ["הוּא יִפְגֹּשׁ", "הוּא פָּגְשָׁה", "הוּא פָּגַשְׁתִּי"] },
      { english: "we arrived", hint: "לְהַגִּיעַ", hebrew: "אֲנַחְנוּ הִגַּעְנוּ", wrong: ["אֲנַחְנוּ נַגִּיעַ", "אֲנַחְנוּ הִגַּעְתִּי", "אֲנַחְנוּ הִגִּיעוּ"] },
      { english: "you all (m.) used", hint: "לְהִשְׁתַּמֵּשׁ", hebrew: "אַתֶּם הִשְׁתַּמַּשְׁתֶּם", wrong: ["אַתֶּם תִּשְׁתַּמְּשׁוּ", "אַתֶּם הִשְׁתַּמְּשׁוּ", "אַתֶּם הִשְׁתַּמַּשְׁתָּ"] },
      { english: "they (m.) looked", hint: "לְהִסְתַּכֵּל", hebrew: "הֵם הִסְתַּכְּלוּ", wrong: ["הֵם יִסְתַּכְּלוּ", "הֵם הִסְתַּכֵּל", "הֵם הִסְתַּכַּלְתֶּם"] },
      { english: "I felt", hint: "לְהַרְגִּישׁ", hebrew: "אֲנִי הִרְגַּשְׁתִּי", wrong: ["אֲנִי אַרְגִּישׁ", "אֲנִי הִרְגַּשְׁנוּ", "אֲנִי הִרְגִּישׁ"] },
      { english: "she visited", hint: "לְבַקֵּר", hebrew: "הִיא בִּקְּרָה", wrong: ["הִיא תְּבַקֵּר", "הִיא בִּקֵּר", "הִיא בִּקַּרְתְּ"] },
      { english: "you (m.) cleaned", hint: "לְנַקּוֹת", hebrew: "אַתָּה נִקִּיתָ", wrong: ["אַתָּה תְּנַקֶּה", "אַתָּה נִקִּית", "אַתָּה נִקִּיתִי"] },
      { english: "he forgot", hint: "לִשְׁכֹּחַ", hebrew: "הוּא שָׁכַח", wrong: ["הוּא יִשְׁכַּח", "הוּא שָׁכְחָה", "הוּא שָׁכַחְתָּ"] },
      { english: "we remembered", hint: "לִזְכֹּר", hebrew: "אֲנַחְנוּ זָכַרְנוּ", wrong: ["אֲנַחְנוּ נִזְכֹּר", "אֲנַחְנוּ זָכַרְתִּי", "אֲנַחְנוּ זָכְרוּ"] },
      { english: "you (f.) found", hint: "לִמְצֹא", hebrew: "אַתְּ מָצָאת", wrong: ["אַתְּ תִּמְצְאִי", "אַתְּ מָצָאתָ", "אַתְּ מָצְאָה"] },
      { english: "they (f.) ran", hint: "לָרוּץ", hebrew: "הֵן רָצוּ", wrong: ["הֵן יָרוּצוּ", "הֵן רַצְנוּ", "הֵן רַצְתֶּם"] },
      { english: "she put", hint: "לָשִׂים", hebrew: "הִיא שָׂמָה", wrong: ["הִיא תָּשִׂים", "הִיא שָׂם", "הִיא שַׂמְתְּ"] },
      { english: "you all (m.) sent", hint: "לִשְׁלֹחַ", hebrew: "אַתֶּם שְׁלַחְתֶּם", wrong: ["אַתֶּם תִּשְׁלְחוּ", "אַתֶּם שָׁלְחוּ", "אַתֶּם שָׁלַחְתָּ"] },
      { english: "you (f.) ate", hint: "לֶאֱכֹל", hebrew: "אַתְּ אָכַלְתְּ", wrong: ["אַתְּ תֹּאכְלִי", "אַתְּ אָכַלְתָּ", "אַתְּ אָכְלָה"] },
      // --- negatives ---
      { english: "I didn't see", hint: "לִרְאוֹת", hebrew: "אֲנִי לֹא רָאִיתִי", wrong: ["אֲנִי לֹא אֶרְאֶה", "אֲנִי לֹא רָאִינוּ", "אֲנִי לֹא רָאָה"] },
      { english: "he didn't come", hint: "לָבוֹא", hebrew: "הוּא לֹא בָּא", wrong: ["הוּא לֹא יָבוֹא", "הוּא לֹא בָּאָה", "הוּא לֹא בָּאתָ"] },
      { english: "we didn't forget", hint: "לִשְׁכֹּחַ", hebrew: "אֲנַחְנוּ לֹא שָׁכַחְנוּ", wrong: ["אֲנַחְנוּ לֹא נִשְׁכַּח", "אֲנַחְנוּ לֹא שָׁכַחְתִּי", "אֲנַחְנוּ לֹא שָׁכְחוּ"] },
      // --- sentences: school ---
      { english: "yesterday I sat next to Noa in class", hint: "לָשֶׁבֶת", hebrew: "אֶתְמוֹל יָשַׁבְתִּי לְיַד נוֹעָה בַּשִּׁעוּר", wrong: ["אֶתְמוֹל אֵשֵׁב לְיַד נוֹעָה בַּשִּׁעוּר", "אֶתְמוֹל יָשַׁבְנוּ לְיַד נוֹעָה בַּשִּׁעוּר", "אֶתְמוֹל יָשַׁבְתִּי אֶת נוֹעָה בַּשִּׁעוּר"] },
      { english: "they (m.) went out to the yard at recess", hint: "לָצֵאת", hebrew: "הֵם יָצְאוּ לֶחָצֵר בַּהַפְסָקָה", wrong: ["הֵם יֵצְאוּ לֶחָצֵר בַּהַפְסָקָה", "הֵם יָצָא לֶחָצֵר בַּהַפְסָקָה", "הֵם יָצְאוּ מֵהֶחָצֵר בַּהַפְסָקָה"] },
      { english: "who took my pen?", hint: "לָקַחַת", hebrew: "מִי לָקַח אֶת הָעֵט שֶׁלִּי?", wrong: ["מִי יִקַּח אֶת הָעֵט שֶׁלִּי?", "מִי לָקַח הָעֵט שֶׁלִּי?", "מִי לָקַחְתָּ אֶת הָעֵט שֶׁלִּי?"] },
      { english: "you (f.) arrived at school on time", hint: "לְהַגִּיעַ", hebrew: "אַתְּ הִגַּעַתְּ לְבֵית הַסֵּפֶר בַּזְּמַן", wrong: ["אַתְּ תַּגִּיעִי לְבֵית הַסֵּפֶר בַּזְּמַן", "אַתְּ הִגַּעְתָּ לְבֵית הַסֵּפֶר בַּזְּמַן", "אַתְּ הִגַּעַתְּ בְּבֵית הַסֵּפֶר בַּזְּמַן"] },
      { english: "she used a dictionary in the test", hint: "לְהִשְׁתַּמֵּשׁ", hebrew: "הִיא הִשְׁתַּמְּשָׁה בְּמִלּוֹן בַּמִּבְחָן", wrong: ["הִיא תִּשְׁתַּמֵּשׁ בְּמִלּוֹן בַּמִּבְחָן", "הִיא הִשְׁתַּמֵּשׁ בְּמִלּוֹן בַּמִּבְחָן", "הִיא הִשְׁתַּמְּשָׁה מִלּוֹן בַּמִּבְחָן"] },
      { english: "I forgot to do the homework", hint: "לִשְׁכֹּחַ", hebrew: "שָׁכַחְתִּי לַעֲשׂוֹת אֶת שִׁעוּרֵי הַבַּיִת", wrong: ["אֶשְׁכַּח לַעֲשׂוֹת אֶת שִׁעוּרֵי הַבַּיִת", "שָׁכַחְנוּ לַעֲשׂוֹת אֶת שִׁעוּרֵי הַבַּיִת", "שָׁכַחְתִּי עָשִׂיתִי אֶת שִׁעוּרֵי הַבַּיִת"] },
      { english: "you (f.) forgot your bag at school", hint: "לִשְׁכֹּחַ", hebrew: "שָׁכַחַתְּ אֶת הַתִּיק שֶׁלָּךְ בְּבֵית הַסֵּפֶר", wrong: ["תִּשְׁכְּחִי אֶת הַתִּיק שֶׁלָּךְ בְּבֵית הַסֵּפֶר", "שָׁכַחְתָּ אֶת הַתִּיק שֶׁלָּךְ בְּבֵית הַסֵּפֶר", "שָׁכַחַתְּ הַתִּיק שֶׁלָּךְ בְּבֵית הַסֵּפֶר"] },
      { english: "you (f.) wrote a great essay", hint: "לִכְתֹּב", hebrew: "אַתְּ כָּתַבְתְּ חִבּוּר מְצֻיָּן", wrong: ["אַתְּ תִּכְתְּבִי חִבּוּר מְצֻיָּן", "אַתְּ כָּתַבְתָּ חִבּוּר מְצֻיָּן", "אַתְּ כָּתַבְתְּ אֶת חִבּוּר מְצֻיָּן"] },
      { english: "we spoke with the teacher after class", hint: "לְדַבֵּר", hebrew: "דִּבַּרְנוּ עִם הַמּוֹרֶה אַחֲרֵי הַשִּׁעוּר", wrong: ["נְדַבֵּר עִם הַמּוֹרֶה אַחֲרֵי הַשִּׁעוּר", "דִּבְּרוּ עִם הַמּוֹרֶה אַחֲרֵי הַשִּׁעוּר", "דִּבַּרְנוּ אֶת הַמּוֹרֶה אַחֲרֵי הַשִּׁעוּר"] },
      { english: "you (m.) gave her the answer", hint: "לָתֵת", hebrew: "נָתַתָּ לָהּ אֶת הַתְּשׁוּבָה", wrong: ["תִּתֵּן לָהּ אֶת הַתְּשׁוּבָה", "נָתַתְּ לָהּ אֶת הַתְּשׁוּבָה", "נָתַתָּ אוֹתָהּ אֶת הַתְּשׁוּבָה"] },
      { english: "she didn't understand what I said", hint: "לְהָבִין", hebrew: "הִיא לֹא הֵבִינָה מָה אָמַרְתִּי", wrong: ["הִיא לֹא תָּבִין מָה אָמַרְתִּי", "הִיא לֹא הֵבִין מָה אָמַרְתִּי", "הִיא לֹא הֵבַנְתְּ מָה אָמַרְתִּי"] },
      { english: "I ran to the bus", hint: "לָרוּץ", hebrew: "רַצְתִּי לָאוֹטוֹבּוּס", wrong: ["אָרוּץ לָאוֹטוֹבּוּס", "רַצְנוּ לָאוֹטוֹבּוּס", "רַצְתִּי אֶת הָאוֹטוֹבּוּס"] },
      // --- sentences: home ---
      { english: "I cleaned my room", hint: "לְנַקּוֹת", hebrew: "נִקִּיתִי אֶת הַחֶדֶר שֶׁלִּי", wrong: ["אֲנַקֶּה אֶת הַחֶדֶר שֶׁלִּי", "נִקִּינוּ אֶת הַחֶדֶר שֶׁלִּי", "נִקִּיתִי הַחֶדֶר שֶׁלִּי"] },
      { english: "after the party they (m.) cleaned the kitchen", hint: "לְנַקּוֹת", hebrew: "אַחֲרֵי הַמְּסִבָּה הֵם נִקּוּ אֶת הַמִּטְבָּח", wrong: ["אַחֲרֵי הַמְּסִבָּה הֵם יְנַקּוּ אֶת הַמִּטְבָּח", "אַחֲרֵי הַמְּסִבָּה הֵם נִקָּה אֶת הַמִּטְבָּח", "אַחֲרֵי הַמְּסִבָּה הֵם נִקּוּ הַמִּטְבָּח"] },
      { english: "she found the keys under the bed", hint: "לִמְצֹא", hebrew: "הִיא מָצְאָה אֶת הַמַּפְתְּחוֹת מִתַּחַת לַמִּטָּה", wrong: ["הִיא תִּמְצָא אֶת הַמַּפְתְּחוֹת מִתַּחַת לַמִּטָּה", "הִיא מָצָא אֶת הַמַּפְתְּחוֹת מִתַּחַת לַמִּטָּה", "הִיא מָצְאָה הַמַּפְתְּחוֹת מִתַּחַת לַמִּטָּה"] },
      { english: "we didn't find him", hint: "לִמְצֹא", hebrew: "לֹא מָצָאנוּ אוֹתוֹ", wrong: ["לֹא נִמְצָא אוֹתוֹ", "לֹא מָצָאתִי אוֹתוֹ", "לֹא מָצָאנוּ אוֹתָהּ"] },
      { english: "he put the phone on the table", hint: "לָשִׂים", hebrew: "הוּא שָׂם אֶת הַטֶּלֶפוֹן עַל הַשֻּׁלְחָן", wrong: ["הוּא יָשִׂים אֶת הַטֶּלֶפוֹן עַל הַשֻּׁלְחָן", "הוּא שָׂמָה אֶת הַטֶּלֶפוֹן עַל הַשֻּׁלְחָן", "הוּא שָׂם הַטֶּלֶפוֹן עַל הַשֻּׁלְחָן"] },
      { english: "where did you (m.) put my shoes?", hint: "לָשִׂים", hebrew: "אֵיפֹה שַׂמְתָּ אֶת הַנַּעֲלַיִם שֶׁלִּי?", wrong: ["אֵיפֹה תָּשִׂים אֶת הַנַּעֲלַיִם שֶׁלִּי?", "אֵיפֹה שַׂמְתְּ אֶת הַנַּעֲלַיִם שֶׁלִּי?", "אֵיפֹה שַׂמְתָּ הַנַּעֲלַיִם שֶׁלִּי?"] },
      { english: "yesterday he didn't feel well", hint: "לְהַרְגִּישׁ", hebrew: "אֶתְמוֹל הוּא לֹא הִרְגִּישׁ טוֹב", wrong: ["אֶתְמוֹל הוּא לֹא יַרְגִּישׁ טוֹב", "אֶתְמוֹל הוּא לֹא הִרְגִּישָׁה טוֹב", "אֶתְמוֹל הוּא לֹא הִרְגַּשְׁתָּ טוֹב"] },
      // --- sentences: friends ---
      { english: "on Saturday I went out with friends", hint: "לָצֵאת", hebrew: "בְּשַׁבָּת יָצָאתִי עִם חֲבֵרִים", wrong: ["בְּשַׁבָּת אֵצֵא עִם חֲבֵרִים", "בְּשַׁבָּת יָצָאנוּ עִם חֲבֵרִים", "בְּשַׁבָּת יָצָאתִי אֶת חֲבֵרִים"] },
      { english: "I met Yoni at the mall", hint: "לִפְגֹּשׁ", hebrew: "פָּגַשְׁתִּי אֶת יוֹנִי בַּקַּנְיוֹן", wrong: ["אֶפְגֹּשׁ אֶת יוֹנִי בַּקַּנְיוֹן", "פָּגַשְׁנוּ אֶת יוֹנִי בַּקַּנְיוֹן", "פָּגַשְׁתִּי יוֹנִי בַּקַּנְיוֹן"] },
      { english: "last week she met them (m.) at the beach", hint: "לִפְגֹּשׁ", hebrew: "בַּשָּׁבוּעַ שֶׁעָבַר הִיא פָּגְשָׁה אוֹתָם בַּחוֹף", wrong: ["בַּשָּׁבוּעַ שֶׁעָבַר הִיא תִּפְגֹּשׁ אוֹתָם בַּחוֹף", "בַּשָּׁבוּעַ שֶׁעָבַר הִיא פָּגַשׁ אוֹתָם בַּחוֹף", "בַּשָּׁבוּעַ שֶׁעָבַר הִיא פָּגְשָׁה אוֹתָן בַּחוֹף"] },
      { english: "when we arrived, everyone was already there", hint: "לְהַגִּיעַ", hebrew: "כְּשֶׁהִגַּעְנוּ, כֻּלָּם כְּבָר הָיוּ שָׁם", wrong: ["כְּשֶׁנַּגִּיעַ, כֻּלָּם כְּבָר הָיוּ שָׁם", "כְּשֶׁהִגַּעְתִּי, כֻּלָּם כְּבָר הָיוּ שָׁם", "כְּשֶׁהִגַּעְנוּ, כֻּלָּם כְּבָר יִהְיוּ שָׁם"] },
      { english: "I used your (m.) phone", hint: "לְהִשְׁתַּמֵּשׁ", hebrew: "הִשְׁתַּמַּשְׁתִּי בַּטֶּלֶפוֹן שֶׁלְּךָ", wrong: ["אֶשְׁתַּמֵּשׁ בַּטֶּלֶפוֹן שֶׁלְּךָ", "הִשְׁתַּמַּשְׁנוּ בַּטֶּלֶפוֹן שֶׁלְּךָ", "הִשְׁתַּמַּשְׁתִּי אֶת הַטֶּלֶפוֹן שֶׁלְּךָ"] },
      { english: "you (m.) looked at me", hint: "לְהִסְתַּכֵּל", hebrew: "הִסְתַּכַּלְתָּ עָלַי", wrong: ["תִּסְתַּכֵּל עָלַי", "הִסְתַּכַּלְתְּ עָלַי", "הִסְתַּכַּלְתָּ אוֹתִי"] },
      { english: "I sent you (f.) a message", hint: "לִשְׁלֹחַ", hebrew: "שָׁלַחְתִּי לָךְ הוֹדָעָה", wrong: ["אֶשְׁלַח לָךְ הוֹדָעָה", "שָׁלַחְנוּ לָךְ הוֹדָעָה", "שָׁלַחְתִּי אוֹתָךְ הוֹדָעָה"] },
      { english: "she sent the photos to her friends", hint: "לִשְׁלֹחַ", hebrew: "הִיא שָׁלְחָה אֶת הַתְּמוּנוֹת לַחֲבֵרוֹת שֶׁלָּהּ", wrong: ["הִיא תִּשְׁלַח אֶת הַתְּמוּנוֹת לַחֲבֵרוֹת שֶׁלָּהּ", "הִיא שָׁלַח אֶת הַתְּמוּנוֹת לַחֲבֵרוֹת שֶׁלָּהּ", "הִיא שָׁלְחָה הַתְּמוּנוֹת לַחֲבֵרוֹת שֶׁלָּהּ"] },
      { english: "I invited Yael and she came", hint: "לְהַזְמִין", hebrew: "הִזְמַנְתִּי אֶת יָעֵל וְהִיא בָּאָה", wrong: ["אַזְמִין אֶת יָעֵל וְהִיא בָּאָה", "הִזְמַנְתִּי אֶת יָעֵל וְהִיא בָּא", "הִזְמַנְתִּי יָעֵל וְהִיא בָּאָה"] },
      { english: "they (f.) told us about the trip", hint: "לְסַפֵּר", hebrew: "הֵן סִפְּרוּ לָנוּ עַל הַטִּיּוּל", wrong: ["הֵן יְסַפְּרוּ לָנוּ עַל הַטִּיּוּל", "הֵן סִפְּרָה לָנוּ עַל הַטִּיּוּל", "הֵן סִפְּרוּ אוֹתָנוּ עַל הַטִּיּוּל"] },
      // --- sentences: weekend and trips ---
      { english: "we sat in the garden all evening", hint: "לָשֶׁבֶת", hebrew: "יָשַׁבְנוּ בַּגִּנָּה כָּל הָעֶרֶב", wrong: ["נֵשֵׁב בַּגִּנָּה כָּל הָעֶרֶב", "יָשְׁבוּ בַּגִּנָּה כָּל הָעֶרֶב", "יָשַׁבְנוּ לַגִּנָּה כָּל הָעֶרֶב"] },
      { english: "on Friday we visited Grandma", hint: "לְבַקֵּר", hebrew: "בְּיוֹם שִׁשִּׁי בִּקַּרְנוּ אֶת סַבְתָּא", wrong: ["בְּיוֹם שִׁשִּׁי נְבַקֵּר אֶת סַבְתָּא", "בְּיוֹם שִׁשִּׁי בִּקְּרוּ אֶת סַבְתָּא", "בְּיוֹם שִׁשִּׁי בִּקַּרְנוּ לְסַבְתָּא"] },
      { english: "a year ago they (m.) visited Jerusalem", hint: "לְבַקֵּר", hebrew: "לִפְנֵי שָׁנָה הֵם בִּקְּרוּ בִּירוּשָׁלַיִם", wrong: ["לִפְנֵי שָׁנָה הֵם יְבַקְּרוּ בִּירוּשָׁלַיִם", "לִפְנֵי שָׁנָה הֵם בִּקֵּר בִּירוּשָׁלַיִם", "לִפְנֵי שָׁנָה הֵם בִּקְּרוּ לִירוּשָׁלַיִם"] },
      { english: "did you all (m.) remember to bring water?", hint: "לִזְכֹּר", hebrew: "זְכַרְתֶּם לְהָבִיא מַיִם?", wrong: ["תִּזְכְּרוּ לְהָבִיא מַיִם?", "זָכְרוּ לְהָבִיא מַיִם?", "זָכַרְתָּ לְהָבִיא מַיִם?"] },
      { english: "we looked at the stars", hint: "לְהִסְתַּכֵּל", hebrew: "הִסְתַּכַּלְנוּ עַל הַכּוֹכָבִים", wrong: ["נִסְתַּכֵּל עַל הַכּוֹכָבִים", "הִסְתַּכַּלְתִּי עַל הַכּוֹכָבִים", "הִסְתַּכַּלְנוּ אֶת הַכּוֹכָבִים"] },
      { english: "we got up early and left for the trip", hint: "לָקוּם", hebrew: "קַמְנוּ מֻקְדָּם וְיָצָאנוּ לַטִּיּוּל", wrong: ["נָקוּם מֻקְדָּם וְנֵצֵא לַטִּיּוּל", "קַמְנוּ מֻקְדָּם וְיָצְאוּ לַטִּיּוּל", "קַמְתִּי מֻקְדָּם וְיָצָאתִי לַטִּיּוּל"] },
      { english: "last month the class traveled to the Golan", hint: "לִנְסֹעַ", hebrew: "בַּחֹדֶשׁ שֶׁעָבַר הַכִּתָּה נָסְעָה לַגּוֹלָן", wrong: ["בַּחֹדֶשׁ שֶׁעָבַר הַכִּתָּה תִּסַּע לַגּוֹלָן", "בַּחֹדֶשׁ שֶׁעָבַר הַכִּתָּה נָסַע לַגּוֹלָן", "בַּחֹדֶשׁ שֶׁעָבַר הַכִּתָּה נָסְעָה בַּגּוֹלָן"] },
    ],
  },
  {
    id: "tense-future", kind: "tense", icon: "⏩", english: "Key concept: future tense", hebrew: "מֻשָּׂג מַפְתֵּחַ: עָתִיד",
    words: [
      { english: "I will write", hint: "לִכְתֹּב", hebrew: "אֲנִי אֶכְתֹּב", wrong: ["אֲנִי כָּתַבְתִּי", "אֲנִי נִכְתֹּב", "אֲנִי יִכְתֹּב"] },
      { english: "you (m.) will eat", hint: "לֶאֱכֹל", hebrew: "אַתָּה תֹּאכַל", wrong: ["אַתָּה אָכַלְתָּ", "אַתָּה תֹּאכְלִי", "אַתָּה יֹאכַל"] },
      { english: "you (f.) will speak", hint: "לְדַבֵּר", hebrew: "אַתְּ תְּדַבְּרִי", wrong: ["אַתְּ דִּבַּרְתְּ", "אַתְּ תְּדַבֵּר", "אַתְּ נְדַבֵּר"] },
      { english: "he will start", hint: "לְהַתְחִיל", hebrew: "הוּא יַתְחִיל", wrong: ["הוּא הִתְחִיל", "הוּא תַּתְחִיל", "הוּא אַתְחִיל"] },
      { english: "she will buy", hint: "לִקְנוֹת", hebrew: "הִיא תִּקְנֶה", wrong: ["הִיא קָנְתָה", "הִיא יִקְנֶה", "הִיא תִּקְנִי"] },
      { english: "we will get dressed", hint: "לְהִתְלַבֵּשׁ", hebrew: "אֲנַחְנוּ נִתְלַבֵּשׁ", wrong: ["אֲנַחְנוּ הִתְלַבַּשְׁנוּ", "אֲנַחְנוּ אֶתְלַבֵּשׁ", "אֲנַחְנוּ יִתְלַבְּשׁוּ"] },
      { english: "you all (m.) will travel", hint: "לִנְסֹעַ", hebrew: "אַתֶּם תִּסְעוּ", wrong: ["אַתֶּם נְסַעְתֶּם", "אַתֶּם יִסְעוּ", "אַתֶּם תִּסַּע"] },
      { english: "they (m.) will sing", hint: "לָשִׁיר", hebrew: "הֵם יָשִׁירוּ", wrong: ["הֵם שָׁרוּ", "הֵם תָּשִׁירוּ", "הֵם יָשִׁיר"] },
      { english: "I will get up", hint: "לָקוּם", hebrew: "אֲנִי אָקוּם", wrong: ["אֲנִי קַמְתִּי", "אֲנִי נָקוּם", "אֲנִי יָקוּם"] },
      { english: "you (m.) will understand", hint: "לְהָבִין", hebrew: "אַתָּה תָּבִין", wrong: ["אַתָּה הֵבַנְתָּ", "אַתָּה תָּבִינִי", "אַתָּה אָבִין"] },
      { english: "you (f.) will invite", hint: "לְהַזְמִין", hebrew: "אַתְּ תַּזְמִינִי", wrong: ["אַתְּ הִזְמַנְתְּ", "אַתְּ תַּזְמִין", "אַתְּ נַזְמִין"] },
      { english: "he will give", hint: "לָתֵת", hebrew: "הוּא יִתֵּן", wrong: ["הוּא נָתַן", "הוּא תִּתֵּן", "הוּא אֶתֵּן"] },
      { english: "she will play", hint: "לְשַׂחֵק", hebrew: "הִיא תְּשַׂחֵק", wrong: ["הִיא שִׂחֲקָה", "הִיא יְשַׂחֵק", "הִיא תְּשַׂחֲקִי"] },
      { english: "we will come", hint: "לָבוֹא", hebrew: "אֲנַחְנוּ נָבוֹא", wrong: ["אֲנַחְנוּ בָּאנוּ", "אֲנַחְנוּ אָבוֹא", "אֲנַחְנוּ יָבוֹאוּ"] },
      { english: "you all (m.) will say", hint: "לְהַגִּיד", hebrew: "אַתֶּם תַּגִּידוּ", wrong: ["אַתֶּם אֲמַרְתֶּם", "אַתֶּם יַגִּידוּ", "אַתֶּם תַּגִּיד"] },
      { english: "they (f.) will see", hint: "לִרְאוֹת", hebrew: "הֵן יִרְאוּ", wrong: ["הֵן רָאוּ", "הֵן תִּרְאֶה", "הֵן נִרְאֶה"] },
      { english: "she will tell", hint: "לְסַפֵּר", hebrew: "הִיא תְּסַפֵּר", wrong: ["הִיא סִפְּרָה", "הִיא יְסַפֵּר", "הִיא תְּסַפְּרִי"] },
      { english: "you (f.) will drink", hint: "לִשְׁתּוֹת", hebrew: "אַתְּ תִּשְׁתִּי", wrong: ["אַתְּ שָׁתִית", "אַתְּ תִּשְׁתֶּה", "אַתְּ נִשְׁתֶּה"] },
      { english: "tomorrow I will write a letter to Dana", hint: "לִכְתֹּב", hebrew: "מָחָר אֶכְתֹּב מִכְתָּב לְדָנָה", wrong: ["מָחָר כָּתַבְתִּי מִכְתָּב לְדָנָה", "מָחָר אֶכְתֹּב אֶת מִכְתָּב לְדָנָה", "מָחָר נִכְתֹּב מִכְתָּב לְדָנָה"] },
      { english: "tonight we will eat the pizza", hint: "לֶאֱכֹל", hebrew: "הָעֶרֶב נֹאכַל אֶת הַפִּיצָה", wrong: ["הָעֶרֶב אָכַלְנוּ אֶת הַפִּיצָה", "הָעֶרֶב נֹאכַל הַפִּיצָה", "הָעֶרֶב יֹאכְלוּ אֶת הַפִּיצָה"] },
      { english: "she will speak with her mother", hint: "לְדַבֵּר", hebrew: "הִיא תְּדַבֵּר עִם אִמָּא שֶׁלָּהּ", wrong: ["הִיא דִּבְּרָה עִם אִמָּא שֶׁלָּהּ", "הִיא יְדַבֵּר עִם אִמָּא שֶׁלָּהּ", "הִיא תְּדַבֵּר אֶת אִמָּא שֶׁלָּהּ"] },
      { english: "he will tell me a story", hint: "לְסַפֵּר", hebrew: "הוּא יְסַפֵּר לִי סִפּוּר", wrong: ["הוּא סִפֵּר לִי סִפּוּר", "הוּא יְסַפֵּר אוֹתִי סִפּוּר", "הוּא תְּסַפֵּר לִי סִפּוּר"] },
      { english: "you (m.) will say thank you", hint: "לְהַגִּיד", hebrew: "אַתָּה תַּגִּיד תּוֹדָה", wrong: ["אַתָּה אָמַרְתָּ תּוֹדָה", "אַתָּה תַּגִּידִי תּוֹדָה", "אַתָּה יַגִּיד תּוֹדָה"] },
      { english: "what will you (f.) say?", hint: "לְהַגִּיד", hebrew: "מָה תַּגִּידִי?", wrong: ["מָה אָמַרְתְּ?", "מָה תַּגִּיד?", "מָה נַגִּיד?"] },
      { english: "the movie will start at eight", hint: "לְהַתְחִיל", hebrew: "הַסֶּרֶט יַתְחִיל בִּשְׁמוֹנֶה", wrong: ["הַסֶּרֶט הִתְחִיל בִּשְׁמוֹנֶה", "הַסֶּרֶט תַּתְחִיל בִּשְׁמוֹנֶה", "הַסֶּרֶט יַתְחִיל לִשְׁמוֹנֶה"] },
      { english: "we will start the game", hint: "לְהַתְחִיל", hebrew: "נַתְחִיל אֶת הַמִּשְׂחָק", wrong: ["הִתְחַלְנוּ אֶת הַמִּשְׂחָק", "נַתְחִיל הַמִּשְׂחָק", "אַתְחִיל אֶת הַמִּשְׂחָק"] },
      { english: "tomorrow I will get dressed quickly", hint: "לְהִתְלַבֵּשׁ", hebrew: "מָחָר אֶתְלַבֵּשׁ מַהֵר", wrong: ["מָחָר הִתְלַבַּשְׁתִּי מַהֵר", "מָחָר נִתְלַבֵּשׁ מַהֵר", "מָחָר יִתְלַבֵּשׁ מַהֵר"] },
      { english: "they (f.) will get dressed for the party", hint: "לְהִתְלַבֵּשׁ", hebrew: "הֵן יִתְלַבְּשׁוּ לַמְּסִבָּה", wrong: ["הֵן הִתְלַבְּשׁוּ לַמְּסִבָּה", "הֵן תִּתְלַבֵּשׁ לַמְּסִבָּה", "הֵן יִתְלַבְּשׁוּ אֶת הַמְּסִבָּה"] },
      { english: "you (f.) will buy a new dress", hint: "לִקְנוֹת", hebrew: "אַתְּ תִּקְנִי שִׂמְלָה חֲדָשָׁה", wrong: ["אַתְּ קָנִית שִׂמְלָה חֲדָשָׁה", "אַתְּ תִּקְנֶה שִׂמְלָה חֲדָשָׁה", "אַתְּ תִּקְנִי אֶת שִׂמְלָה חֲדָשָׁה"] },
      { english: "next week they (m.) will buy the tickets", hint: "לִקְנוֹת", hebrew: "בַּשָּׁבוּעַ הַבָּא הֵם יִקְנוּ אֶת הַכַּרְטִיסִים", wrong: ["בַּשָּׁבוּעַ הַבָּא הֵם קָנוּ אֶת הַכַּרְטִיסִים", "בַּשָּׁבוּעַ הַבָּא הֵם יִקְנוּ הַכַּרְטִיסִים", "בַּשָּׁבוּעַ הַבָּא הֵם יִקְנֶה אֶת הַכַּרְטִיסִים"] },
      { english: "I will see her tomorrow", hint: "לִרְאוֹת", hebrew: "אֶרְאֶה אוֹתָהּ מָחָר", wrong: ["רָאִיתִי אוֹתָהּ מָחָר", "אֶרְאֶה אֶת הִיא מָחָר", "אֶרְאֶה אוֹתוֹ מָחָר"] },
      { english: "you all (m.) will see the game", hint: "לִרְאוֹת", hebrew: "אַתֶּם תִּרְאוּ אֶת הַמִּשְׂחָק", wrong: ["אַתֶּם רְאִיתֶם אֶת הַמִּשְׂחָק", "אַתֶּם תִּרְאוּ הַמִּשְׂחָק", "אַתֶּם יִרְאוּ אֶת הַמִּשְׂחָק"] },
      { english: "tomorrow I will get up at seven", hint: "לָקוּם", hebrew: "מָחָר אָקוּם בְּשֶׁבַע", wrong: ["מָחָר קַמְתִּי בְּשֶׁבַע", "מָחָר נָקוּם בְּשֶׁבַע", "מָחָר תָּקוּם בְּשֶׁבַע"] },
      { english: "she will get up early", hint: "לָקוּם", hebrew: "הִיא תָּקוּם מֻקְדָּם", wrong: ["הִיא קָמָה מֻקְדָּם", "הִיא יָקוּם מֻקְדָּם", "הִיא תָּקוּמִי מֻקְדָּם"] },
      { english: "he will come to school by bus", hint: "לָבוֹא", hebrew: "הוּא יָבוֹא לְבֵית הַסֵּפֶר בָּאוֹטוֹבּוּס", wrong: ["הוּא בָּא לְבֵית הַסֵּפֶר בָּאוֹטוֹבּוּס", "הוּא תָּבוֹא לְבֵית הַסֵּפֶר בָּאוֹטוֹבּוּס", "הוּא יָבוֹא בְּבֵית הַסֵּפֶר בָּאוֹטוֹבּוּס"] },
      { english: "you (m.) will come home early", hint: "לָבוֹא", hebrew: "אַתָּה תָּבוֹא הַבַּיְתָה מֻקְדָּם", wrong: ["אַתָּה בָּאתָ הַבַּיְתָה מֻקְדָּם", "אַתָּה תָּבוֹאִי הַבַּיְתָה מֻקְדָּם", "אַתָּה תָּבוֹא בַּבַּיִת מֻקְדָּם"] },
      { english: "we will sing a song at the party", hint: "לָשִׁיר", hebrew: "נָשִׁיר שִׁיר בַּמְּסִבָּה", wrong: ["שַׁרְנוּ שִׁיר בַּמְּסִבָּה", "אָשִׁיר שִׁיר בַּמְּסִבָּה", "נָשִׁיר אֶת שִׁיר בַּמְּסִבָּה"] },
      { english: "I will give him the book", hint: "לָתֵת", hebrew: "אֶתֵּן לוֹ אֶת הַסֵּפֶר", wrong: ["נָתַתִּי לוֹ אֶת הַסֵּפֶר", "אֶתֵּן אוֹתוֹ אֶת הַסֵּפֶר", "אֶתֵּן לוֹ הַסֵּפֶר"] },
      { english: "she will give us a present", hint: "לָתֵת", hebrew: "הִיא תִּתֵּן לָנוּ מַתָּנָה", wrong: ["הִיא נָתְנָה לָנוּ מַתָּנָה", "הִיא יִתֵּן לָנוּ מַתָּנָה", "הִיא תִּתֵּן אוֹתָנוּ מַתָּנָה"] },
      { english: "next year we will travel to Eilat", hint: "לִנְסֹעַ", hebrew: "בַּשָּׁנָה הַבָּאָה נִסַּע לְאֵילַת", wrong: ["בַּשָּׁנָה הַבָּאָה נָסַעְנוּ לְאֵילַת", "בַּשָּׁנָה הַבָּאָה יִסְעוּ לְאֵילַת", "בַּשָּׁנָה הַבָּאָה נִסַּע בְּאֵילַת"] },
      { english: "you (f.) will travel by train", hint: "לִנְסֹעַ", hebrew: "אַתְּ תִּסְעִי בָּרַכֶּבֶת", wrong: ["אַתְּ נָסַעְתְּ בָּרַכֶּבֶת", "אַתְּ תִּסַּע בָּרַכֶּבֶת", "אַתְּ תִּסְעִי לָרַכֶּבֶת"] },
      { english: "you all (m.) will understand the question", hint: "לְהָבִין", hebrew: "אַתֶּם תָּבִינוּ אֶת הַשְּׁאֵלָה", wrong: ["אַתֶּם הֲבַנְתֶּם אֶת הַשְּׁאֵלָה", "אַתֶּם תָּבִינוּ הַשְּׁאֵלָה", "אַתֶּם יָבִינוּ אֶת הַשְּׁאֵלָה"] },
      { english: "they (m.) will understand him", hint: "לְהָבִין", hebrew: "הֵם יָבִינוּ אוֹתוֹ", wrong: ["הֵם הֵבִינוּ אוֹתוֹ", "הֵם יָבִינוּ אֶת הוּא", "הֵם יָבִינוּ אוֹתָהּ"] },
      { english: "he will invite me to the party", hint: "לְהַזְמִין", hebrew: "הוּא יַזְמִין אוֹתִי לַמְּסִבָּה", wrong: ["הוּא הִזְמִין אוֹתִי לַמְּסִבָּה", "הוּא תַּזְמִין אוֹתִי לַמְּסִבָּה", "הוּא יַזְמִין אוֹתָהּ לַמְּסִבָּה"] },
      { english: "we will invite them (f.)", hint: "לְהַזְמִין", hebrew: "נַזְמִין אוֹתָן", wrong: ["הִזְמַנּוּ אוֹתָן", "נַזְמִין אוֹתָם", "נַזְמִין אֶת הֵן"] },
      { english: "they (m.) will play soccer", hint: "לְשַׂחֵק", hebrew: "הֵם יְשַׂחֲקוּ כַּדּוּרֶגֶל", wrong: ["הֵם שִׂחֲקוּ כַּדּוּרֶגֶל", "הֵם יְשַׂחֵק כַּדּוּרֶגֶל", "הֵם תְּשַׂחֲקוּ כַּדּוּרֶגֶל"] },
      { english: "he will drink all the water", hint: "לִשְׁתּוֹת", hebrew: "הוּא יִשְׁתֶּה אֶת כָּל הַמַּיִם", wrong: ["הוּא שָׁתָה אֶת כָּל הַמַּיִם", "הוּא יִשְׁתֶּה כָּל הַמַּיִם", "הוּא תִּשְׁתֶּה אֶת כָּל הַמַּיִם"] },
      { english: "you (m.) will do the homework", hint: "לַעֲשׂוֹת", hebrew: "אַתָּה תַּעֲשֶׂה אֶת שִׁעוּרֵי הַבַּיִת", wrong: ["אַתָּה עָשִׂיתָ אֶת שִׁעוּרֵי הַבַּיִת", "אַתָּה תַּעֲשִׂי אֶת שִׁעוּרֵי הַבַּיִת", "אַתָּה תַּעֲשֶׂה שִׁעוּרֵי הַבַּיִת"] },
      // ----- More practice (2026-11-12) -----
      // short: pronoun + verb (new verbs and new persons)
      { english: "I will sit", hint: "לָשֶׁבֶת", hebrew: "אֲנִי אֵשֵׁב", wrong: ["אֲנִי יָשַׁבְתִּי", "אֲנִי נֵשֵׁב", "אֲנִי יֵשֵׁב"] },
      { english: "you (f.) will go out", hint: "לָצֵאת", hebrew: "אַתְּ תֵּצְאִי", wrong: ["אַתְּ יָצָאת", "אַתְּ תֵּצֵא", "אַתְּ נֵצֵא"] },
      { english: "he will take", hint: "לָקַחַת", hebrew: "הוּא יִקַּח", wrong: ["הוּא לָקַח", "הוּא תִּקַּח", "הוּא אֶקַּח"] },
      { english: "she will meet", hint: "לִפְגֹּשׁ", hebrew: "הִיא תִּפְגֹּשׁ", wrong: ["הִיא פָּגְשָׁה", "הִיא יִפְגֹּשׁ", "הִיא תִּפְגְּשִׁי"] },
      { english: "we will arrive", hint: "לְהַגִּיעַ", hebrew: "אֲנַחְנוּ נַגִּיעַ", wrong: ["אֲנַחְנוּ הִגַּעְנוּ", "אֲנַחְנוּ אַגִּיעַ", "אֲנַחְנוּ יַגִּיעוּ"] },
      { english: "you all (m.) will feel", hint: "לְהַרְגִּישׁ", hebrew: "אַתֶּם תַּרְגִּישׁוּ", wrong: ["אַתֶּם הִרְגַּשְׁתֶּם", "אַתֶּם יַרְגִּישׁוּ", "אַתֶּם תַּרְגִּישׁ"] },
      { english: "they (m.) will look", hint: "לְהִסְתַּכֵּל", hebrew: "הֵם יִסְתַּכְּלוּ", wrong: ["הֵם הִסְתַּכְּלוּ", "הֵם תִּסְתַּכְּלוּ", "הֵם יִסְתַּכֵּל"] },
      { english: "you (m.) will remember", hint: "לִזְכֹּר", hebrew: "אַתָּה תִּזְכֹּר", wrong: ["אַתָּה זָכַרְתָּ", "אַתָּה תִּזְכְּרִי", "אַתָּה יִזְכֹּר"] },
      { english: "I won't forget", hint: "לִשְׁכֹּחַ", hebrew: "אֲנִי לֹא אֶשְׁכַּח", wrong: ["אֲנִי לֹא שָׁכַחְתִּי", "אֲנִי לֹא נִשְׁכַּח", "אֲנִי לֹא יִשְׁכַּח"] },
      { english: "she will run", hint: "לָרוּץ", hebrew: "הִיא תָּרוּץ", wrong: ["הִיא רָצָה", "הִיא יָרוּץ", "הִיא תָּרוּצִי"] },
      { english: "you (f.) will find", hint: "לִמְצֹא", hebrew: "אַתְּ תִּמְצְאִי", wrong: ["אַתְּ מָצָאת", "אַתְּ תִּמְצָא", "אַתְּ נִמְצָא"] },
      { english: "they (f.) will send", hint: "לִשְׁלֹחַ", hebrew: "הֵן יִשְׁלְחוּ", wrong: ["הֵן שָׁלְחוּ", "הֵן תִּשְׁלַח", "הֵן נִשְׁלַח"] },
      { english: "he will clean", hint: "לְנַקּוֹת", hebrew: "הוּא יְנַקֶּה", wrong: ["הוּא נִקָּה", "הוּא תְּנַקֶּה", "הוּא אֲנַקֶּה"] },
      { english: "we will visit", hint: "לְבַקֵּר", hebrew: "אֲנַחְנוּ נְבַקֵּר", wrong: ["אֲנַחְנוּ בִּקַּרְנוּ", "אֲנַחְנוּ אֲבַקֵּר", "אֲנַחְנוּ יְבַקְּרוּ"] },
      { english: "you all (m.) won't forget", hint: "לִשְׁכֹּחַ", hebrew: "אַתֶּם לֹא תִּשְׁכְּחוּ", wrong: ["אַתֶּם לֹא שְׁכַחְתֶּם", "אַתֶּם לֹא יִשְׁכְּחוּ", "אַתֶּם לֹא תִּשְׁכַּח"] },
      { english: "I will run", hint: "לָרוּץ", hebrew: "אֲנִי אָרוּץ", wrong: ["אֲנִי רַצְתִּי", "אֲנִי נָרוּץ", "אֲנִי יָרוּץ"] },
      { english: "they (m.) will write", hint: "לִכְתֹּב", hebrew: "הֵם יִכְתְּבוּ", wrong: ["הֵם כָּתְבוּ", "הֵם תִּכְתְּבוּ", "הֵם יִכְתֹּב"] },
      { english: "you (f.) will eat", hint: "לֶאֱכֹל", hebrew: "אַתְּ תֹּאכְלִי", wrong: ["אַתְּ אָכַלְתְּ", "אַתְּ תֹּאכַל", "אַתְּ נֹאכַל"] },
      { english: "he won't come", hint: "לָבוֹא", hebrew: "הוּא לֹא יָבוֹא", wrong: ["הוּא לֹא בָּא", "הוּא לֹא תָּבוֹא", "הוּא לֹא אָבוֹא"] },
      { english: "she will understand", hint: "לְהָבִין", hebrew: "הִיא תָּבִין", wrong: ["הִיא הֵבִינָה", "הִיא יָבִין", "הִיא תָּבִינִי"] },
      // sentences: new verbs in context
      { english: "tomorrow I will sit next to Noa", hint: "לָשֶׁבֶת", hebrew: "מָחָר אֵשֵׁב לְיַד נֹעָה", wrong: ["מָחָר יָשַׁבְתִּי לְיַד נֹעָה", "מָחָר נֵשֵׁב לְיַד נֹעָה", "מָחָר יֵשֵׁב לְיַד נֹעָה"] },
      { english: "in an hour we will go out to the park", hint: "לָצֵאת", hebrew: "בְּעוֹד שָׁעָה נֵצֵא לַפַּארְק", wrong: ["בְּעוֹד שָׁעָה יָצָאנוּ לַפַּארְק", "בְּעוֹד שָׁעָה אֵצֵא לַפַּארְק", "בְּעוֹד שָׁעָה נֵצֵא בַּפַּארְק"] },
      { english: "on the weekend he will go out with his friends", hint: "לָצֵאת", hebrew: "בְּסוֹף הַשָּׁבוּעַ הוּא יֵצֵא עִם הַחֲבֵרִים שֶׁלּוֹ", wrong: ["בְּסוֹף הַשָּׁבוּעַ הוּא יָצָא עִם הַחֲבֵרִים שֶׁלּוֹ", "בְּסוֹף הַשָּׁבוּעַ הוּא תֵּצֵא עִם הַחֲבֵרִים שֶׁלּוֹ", "בְּסוֹף הַשָּׁבוּעַ הוּא יֵצֵא אֶת הַחֲבֵרִים שֶׁלּוֹ"] },
      { english: "when will you (f.) leave the house?", hint: "לָצֵאת", hebrew: "מָתַי תֵּצְאִי מֵהַבַּיִת?", wrong: ["מָתַי יָצָאת מֵהַבַּיִת?", "מָתַי תֵּצֵא מֵהַבַּיִת?", "מָתַי תֵּצְאִי לַבַּיִת?"] },
      { english: "tomorrow I will take an umbrella", hint: "לָקַחַת", hebrew: "מָחָר אֶקַּח מִטְרִיָּה", wrong: ["מָחָר לָקַחְתִּי מִטְרִיָּה", "מָחָר נִקַּח מִטְרִיָּה", "מָחָר יִקַּח מִטְרִיָּה"] },
      { english: "you (f.) will take the ball from the room", hint: "לָקַחַת", hebrew: "אַתְּ תִּקְחִי אֶת הַכַּדּוּר מֵהַחֶדֶר", wrong: ["אַתְּ לָקַחַתְּ אֶת הַכַּדּוּר מֵהַחֶדֶר", "אַתְּ תִּקַּח אֶת הַכַּדּוּר מֵהַחֶדֶר", "אַתְּ תִּקְחִי הַכַּדּוּר מֵהַחֶדֶר"] },
      { english: "they (m.) will take us to the beach", hint: "לָקַחַת", hebrew: "הֵם יִקְחוּ אוֹתָנוּ לַיָּם", wrong: ["הֵם לָקְחוּ אוֹתָנוּ לַיָּם", "הֵם יִקַּח אוֹתָנוּ לַיָּם", "הֵם יִקְחוּ לָנוּ לַיָּם"] },
      { english: "I will meet Yoni at the mall", hint: "לִפְגֹּשׁ", hebrew: "אֶפְגֹּשׁ אֶת יוֹנִי בַּקַּנְיוֹן", wrong: ["פָּגַשְׁתִּי אֶת יוֹנִי בַּקַּנְיוֹן", "אֶפְגֹּשׁ יוֹנִי בַּקַּנְיוֹן", "נִפְגֹּשׁ אֶת יוֹנִי בַּקַּנְיוֹן"] },
      { english: "we will meet them (m.) next week", hint: "לִפְגֹּשׁ", hebrew: "נִפְגֹּשׁ אוֹתָם בַּשָּׁבוּעַ הַבָּא", wrong: ["פָּגַשְׁנוּ אוֹתָם בַּשָּׁבוּעַ הַבָּא", "נִפְגֹּשׁ אוֹתָן בַּשָּׁבוּעַ הַבָּא", "נִפְגֹּשׁ לָהֶם בַּשָּׁבוּעַ הַבָּא"] },
      { english: "when I arrive, I will send you (m.) a message", hint: "לְהַגִּיעַ", hebrew: "כְּשֶׁאֲנִי אַגִּיעַ, אֶשְׁלַח לְךָ הוֹדָעָה", wrong: ["כְּשֶׁאֲנִי הִגַּעְתִּי, אֶשְׁלַח לְךָ הוֹדָעָה", "כְּשֶׁאֲנִי יַגִּיעַ, אֶשְׁלַח לְךָ הוֹדָעָה", "כְּשֶׁאֲנִי אַגִּיעַ, אֶשְׁלַח אוֹתְךָ הוֹדָעָה"] },
      { english: "the train will arrive in ten minutes", hint: "לְהַגִּיעַ", hebrew: "הָרַכֶּבֶת תַּגִּיעַ בְּעוֹד עֶשֶׂר דַּקּוֹת", wrong: ["הָרַכֶּבֶת הִגִּיעָה בְּעוֹד עֶשֶׂר דַּקּוֹת", "הָרַכֶּבֶת יַגִּיעַ בְּעוֹד עֶשֶׂר דַּקּוֹת", "הָרַכֶּבֶת תַּגִּיעַ לִפְנֵי עֶשֶׂר דַּקּוֹת"] },
      { english: "tomorrow you (f.) will feel better", hint: "לְהַרְגִּישׁ", hebrew: "מָחָר תַּרְגִּישִׁי יוֹתֵר טוֹב", wrong: ["מָחָר הִרְגַּשְׁתְּ יוֹתֵר טוֹב", "מָחָר תַּרְגִּישׁ יוֹתֵר טוֹב", "מָחָר אַרְגִּישׁ יוֹתֵר טוֹב"] },
      { english: "we will use the computer", hint: "לְהִשְׁתַּמֵּשׁ", hebrew: "נִשְׁתַּמֵּשׁ בַּמַּחְשֵׁב", wrong: ["הִשְׁתַּמַּשְׁנוּ בַּמַּחְשֵׁב", "נִשְׁתַּמֵּשׁ אֶת הַמַּחְשֵׁב", "אֶשְׁתַּמֵּשׁ בַּמַּחְשֵׁב"] },
      { english: "you all (m.) will use a pencil in the test", hint: "לְהִשְׁתַּמֵּשׁ", hebrew: "אַתֶּם תִּשְׁתַּמְּשׁוּ בְּעִפָּרוֹן בַּמִּבְחָן", wrong: ["אַתֶּם הִשְׁתַּמַּשְׁתֶּם בְּעִפָּרוֹן בַּמִּבְחָן", "אַתֶּם יִשְׁתַּמְּשׁוּ בְּעִפָּרוֹן בַּמִּבְחָן", "אַתֶּם תִּשְׁתַּמְּשׁוּ עִפָּרוֹן בַּמִּבְחָן"] },
      { english: "I will look at the pictures", hint: "לְהִסְתַּכֵּל", hebrew: "אֶסְתַּכֵּל עַל הַתְּמוּנוֹת", wrong: ["הִסְתַּכַּלְתִּי עַל הַתְּמוּנוֹת", "אֶסְתַּכֵּל אֶת הַתְּמוּנוֹת", "נִסְתַּכֵּל עַל הַתְּמוּנוֹת"] },
      { english: "you (f.) will look at the map", hint: "לְהִסְתַּכֵּל", hebrew: "אַתְּ תִּסְתַּכְּלִי עַל הַמַּפָּה", wrong: ["אַתְּ הִסְתַּכַּלְתְּ עַל הַמַּפָּה", "אַתְּ תִּסְתַּכֵּל עַל הַמַּפָּה", "אַתְּ תִּסְתַּכְּלִי אֶת הַמַּפָּה"] },
      { english: "on Saturday we will visit grandma", hint: "לְבַקֵּר", hebrew: "בְּשַׁבָּת נְבַקֵּר אֶת סַבְתָּא", wrong: ["בְּשַׁבָּת בִּקַּרְנוּ אֶת סַבְתָּא", "בְּשַׁבָּת נְבַקֵּר לְסַבְתָּא", "בְּשַׁבָּת יְבַקְּרוּ אֶת סַבְתָּא"] },
      { english: "they (f.) will visit us in the summer", hint: "לְבַקֵּר", hebrew: "הֵן יְבַקְּרוּ אוֹתָנוּ בַּקַּיִץ", wrong: ["הֵן בִּקְּרוּ אוֹתָנוּ בַּקַּיִץ", "הֵן תְּבַקֵּר אוֹתָנוּ בַּקַּיִץ", "הֵן יְבַקְּרוּ לָנוּ בַּקַּיִץ"] },
      { english: "I will clean my room", hint: "לְנַקּוֹת", hebrew: "אֲנַקֶּה אֶת הַחֶדֶר שֶׁלִּי", wrong: ["נִקִּיתִי אֶת הַחֶדֶר שֶׁלִּי", "אֲנַקֶּה הַחֶדֶר שֶׁלִּי", "נְנַקֶּה אֶת הַחֶדֶר שֶׁלִּי"] },
      { english: "after the party you all (m.) will clean the kitchen", hint: "לְנַקּוֹת", hebrew: "אַחֲרֵי הַמְּסִבָּה אַתֶּם תְּנַקּוּ אֶת הַמִּטְבָּח", wrong: ["אַחֲרֵי הַמְּסִבָּה אַתֶּם נִקִּיתֶם אֶת הַמִּטְבָּח", "אַחֲרֵי הַמְּסִבָּה אַתֶּם יְנַקּוּ אֶת הַמִּטְבָּח", "אַחֲרֵי הַמְּסִבָּה אַתֶּם תְּנַקּוּ הַמִּטְבָּח"] },
      { english: "he will forget the homework at home", hint: "לִשְׁכֹּחַ", hebrew: "הוּא יִשְׁכַּח אֶת שִׁעוּרֵי הַבַּיִת בַּבַּיִת", wrong: ["הוּא שָׁכַח אֶת שִׁעוּרֵי הַבַּיִת בַּבַּיִת", "הוּא תִּשְׁכַּח אֶת שִׁעוּרֵי הַבַּיִת בַּבַּיִת", "הוּא יִשְׁכַּח שִׁעוּרֵי הַבַּיִת בַּבַּיִת"] },
      { english: "you (f.) will remember the answer", hint: "לִזְכֹּר", hebrew: "אַתְּ תִּזְכְּרִי אֶת הַתְּשׁוּבָה", wrong: ["אַתְּ זָכַרְתְּ אֶת הַתְּשׁוּבָה", "אַתְּ תִּזְכֹּר אֶת הַתְּשׁוּבָה", "אַתְּ תִּזְכְּרִי הַתְּשׁוּבָה"] },
      { english: "maybe he will find the ball", hint: "לִמְצֹא", hebrew: "אוּלַי הוּא יִמְצָא אֶת הַכַּדּוּר", wrong: ["אוּלַי הוּא מָצָא אֶת הַכַּדּוּר", "אוּלַי הוּא תִּמְצָא אֶת הַכַּדּוּר", "אוּלַי הוּא יִמְצָא הַכַּדּוּר"] },
      { english: "they (m.) will find a good place to sit", hint: "לִמְצֹא", hebrew: "הֵם יִמְצְאוּ מָקוֹם טוֹב לָשֶׁבֶת", wrong: ["הֵם מָצְאוּ מָקוֹם טוֹב לָשֶׁבֶת", "הֵם יִמְצָא מָקוֹם טוֹב לָשֶׁבֶת", "הֵם יִמְצְאוּ אֶת מָקוֹם טוֹב לָשֶׁבֶת"] },
      { english: "we will run to the bus", hint: "לָרוּץ", hebrew: "נָרוּץ לָאוֹטוֹבּוּס", wrong: ["רַצְנוּ לָאוֹטוֹבּוּס", "אָרוּץ לָאוֹטוֹבּוּס", "יָרוּצוּ לָאוֹטוֹבּוּס"] },
      { english: "tomorrow morning you (m.) will run in the park", hint: "לָרוּץ", hebrew: "מָחָר בַּבֹּקֶר אַתָּה תָּרוּץ בַּפַּארְק", wrong: ["מָחָר בַּבֹּקֶר אַתָּה רַצְתָּ בַּפַּארְק", "מָחָר בַּבֹּקֶר אַתָּה תָּרוּצִי בַּפַּארְק", "מָחָר בַּבֹּקֶר אַתָּה יָרוּץ בַּפַּארְק"] },
      { english: "I will put the bag on the table", hint: "לָשִׂים", hebrew: "אָשִׂים אֶת הַתִּיק עַל הַשֻּׁלְחָן", wrong: ["שַׂמְתִּי אֶת הַתִּיק עַל הַשֻּׁלְחָן", "אָשִׂים הַתִּיק עַל הַשֻּׁלְחָן", "אָשִׂים אֶת הַתִּיק לַשֻּׁלְחָן"] },
      { english: "you (f.) will send me the pictures", hint: "לִשְׁלֹחַ", hebrew: "אַתְּ תִּשְׁלְחִי לִי אֶת הַתְּמוּנוֹת", wrong: ["אַתְּ שָׁלַחְתְּ לִי אֶת הַתְּמוּנוֹת", "אַתְּ תִּשְׁלַח לִי אֶת הַתְּמוּנוֹת", "אַתְּ תִּשְׁלְחִי אוֹתִי אֶת הַתְּמוּנוֹת"] },
      { english: "we will want to travel to the Golan", hint: "לִרְצוֹת", hebrew: "נִרְצֶה לִנְסֹעַ לַגּוֹלָן", wrong: ["רָצִינוּ לִנְסֹעַ לַגּוֹלָן", "נִרְצֶה נִסַּע לַגּוֹלָן", "יִרְצוּ לִנְסֹעַ לַגּוֹלָן"] },
      { english: "she will help me tomorrow", hint: "לַעֲזֹר", hebrew: "הִיא תַּעֲזֹר לִי מָחָר", wrong: ["הִיא עָזְרָה לִי מָחָר", "הִיא תַּעֲזֹר אוֹתִי מָחָר", "הִיא יַעֲזֹר לִי מָחָר"] },
      // sentences: more practice with the deck's verbs
      { english: "you (f.) will write me a letter", hint: "לִכְתֹּב", hebrew: "אַתְּ תִּכְתְּבִי לִי מִכְתָּב", wrong: ["אַתְּ כָּתַבְתְּ לִי מִכְתָּב", "אַתְּ תִּכְתֹּב לִי מִכְתָּב", "אַתְּ תִּכְתְּבִי אוֹתִי מִכְתָּב"] },
      { english: "you (m.) will speak with the teacher after class", hint: "לְדַבֵּר", hebrew: "אַתָּה תְּדַבֵּר עִם הַמּוֹרָה אַחֲרֵי הַשִּׁעוּר", wrong: ["אַתָּה דִּבַּרְתָּ עִם הַמּוֹרָה אַחֲרֵי הַשִּׁעוּר", "אַתָּה תְּדַבְּרִי עִם הַמּוֹרָה אַחֲרֵי הַשִּׁעוּר", "אַתָּה תְּדַבֵּר אֶת הַמּוֹרָה אַחֲרֵי הַשִּׁעוּר"] },
      { english: "I will tell you (f.) what happened", hint: "לְסַפֵּר", hebrew: "אֲסַפֵּר לָךְ מָה קָרָה", wrong: ["סִפַּרְתִּי לָךְ מָה קָרָה", "אֲסַפֵּר לְךָ מָה קָרָה", "אֲסַפֵּר אוֹתָךְ מָה קָרָה"] },
      { english: "I will buy him a present for his birthday", hint: "לִקְנוֹת", hebrew: "אֶקְנֶה לוֹ מַתָּנָה לְיוֹם הַהֻלֶּדֶת שֶׁלּוֹ", wrong: ["קָנִיתִי לוֹ מַתָּנָה לְיוֹם הַהֻלֶּדֶת שֶׁלּוֹ", "אֶקְנֶה אוֹתוֹ מַתָּנָה לְיוֹם הַהֻלֶּדֶת שֶׁלּוֹ", "נִקְנֶה לוֹ מַתָּנָה לְיוֹם הַהֻלֶּדֶת שֶׁלּוֹ"] },
      { english: "when they (m.) come, we will eat", hint: "לָבוֹא", hebrew: "כְּשֶׁהֵם יָבוֹאוּ, נֹאכַל", wrong: ["כְּשֶׁהֵם בָּאוּ, נֹאכַל", "כְּשֶׁהֵם יָבוֹא, נֹאכַל", "כְּשֶׁהֵם יָבוֹאוּ, אָכַלְנוּ"] },
    ],
  },

  // ===== Root decks =====
  {
    id: "root-ktv", kind: "root", pattern: "paal", icon: "🌱", english: "Root כ־ת־ב: write", hebrew: "שֹׁרֶשׁ כ־ת־ב: לִכְתֹּב",
    words: [
      { english: "to write", hebrew: "לִכְתֹּב", wrong: ["כּוֹתֵב", "מִכְתָּב", "לִקְרֹא"] },
      { english: "he writes", hebrew: "הוּא כּוֹתֵב", wrong: ["הוּא כּוֹתֶבֶת", "הוּא כּוֹתְבִים", "הוּא כָּתַב"] },
      { english: "she writes", hebrew: "הִיא כּוֹתֶבֶת", wrong: ["הִיא כּוֹתֵב", "הִיא כּוֹתְבוֹת", "הִיא כָּתְבָה"] },
      { english: "they (m.) write", hebrew: "הֵם כּוֹתְבִים", wrong: ["הֵם כּוֹתְבוֹת", "הֵם כּוֹתֵב", "הֵם כָּתְבוּ"] },
      { english: "they (f.) write", hebrew: "הֵן כּוֹתְבוֹת", wrong: ["הֵן כּוֹתְבִים", "הֵן כּוֹתֶבֶת", "הֵן כָּתְבוּ"] },
      { english: "a letter", hebrew: "מִכְתָּב", wrong: ["כְּתֹבֶת", "כְּתִיבָה", "כַּתָּב"] },
      { english: "an address", hebrew: "כְּתֹבֶת", wrong: ["מִכְתָּב", "כְּתִיבָה", "כַּתָּב"] },
      { english: "writing", hebrew: "כְּתִיבָה", wrong: ["כְּתֹבֶת", "מִכְתָּב", "כּוֹתֵב"] },
      { english: "a reporter (m.)", hebrew: "כַּתָּב", wrong: ["מִכְתָּב", "כְּתֹבֶת", "כַּתֶּבֶת"] },
      // כּוֹתֵב + אֶת (what) / לְ (to whom) / עַל (about, or on a surface) / בְּ (with a tool)
      { english: "she writes the address", hebrew: "הִיא כּוֹתֶבֶת אֶת הַכְּתֹבֶת", wrong: ["הִיא כּוֹתֶבֶת הַכְּתֹבֶת", "הִיא כּוֹתֶבֶת לַכְּתֹבֶת", "הִיא כּוֹתֶבֶת עַל הַכְּתֹבֶת"] },
      { english: "he writes a letter to Dana", hebrew: "הוּא כּוֹתֵב מִכְתָּב לְדָנָה", wrong: ["הוּא כּוֹתֵב מִכְתָּב עַל דָּנָה", "הוּא כּוֹתֵב מִכְתָּב אֶת דָּנָה", "הוּא כּוֹתֵב מִכְתָּב בְּדָנָה"] },
      { english: "he writes about Dana", hebrew: "הוּא כּוֹתֵב עַל דָּנָה", wrong: ["הוּא כּוֹתֵב לְדָנָה", "הוּא כּוֹתֵב אֶת דָּנָה", "הוּא כּוֹתֵב עִם דָּנָה"] },
      { english: "she writes about the trip", hebrew: "הִיא כּוֹתֶבֶת עַל הַטִּיּוּל", wrong: ["הִיא כּוֹתֶבֶת לַטִּיּוּל", "הִיא כּוֹתֶבֶת אֶת הַטִּיּוּל", "הִיא כּוֹתֶבֶת מֵהַטִּיּוּל"] },
      { english: "he writes on the board", hebrew: "הוּא כּוֹתֵב עַל הַלּוּחַ", wrong: ["הוּא כּוֹתֵב לַלּוּחַ", "הוּא כּוֹתֵב אֶת הַלּוּחַ", "הוּא כּוֹתֵב מֵהַלּוּחַ"] },
      { english: "they (m.) write with a pen", hebrew: "הֵם כּוֹתְבִים בְּעֵט", wrong: ["הֵם כּוֹתְבִים לְעֵט", "הֵם כּוֹתְבִים עַל עֵט", "הֵם כּוֹתְבִים אֶת עֵט"] },
      // The describing word from the root (כָּתוּב = written) vs. the action (כּוֹתֵב = writes)
      { english: "written", hebrew: "כָּתוּב", wrong: ["כּוֹתֵב", "נִכְתַּב", "כְּתוּבָה"] },
      { english: "the address is written on the letter", hebrew: "הַכְּתֹבֶת כְּתוּבָה עַל הַמִּכְתָּב", wrong: ["הַכְּתֹבֶת כּוֹתֶבֶת עַל הַמִּכְתָּב", "הַכְּתֹבֶת כָּתוּב עַל הַמִּכְתָּב", "הַכְּתֹבֶת כְּתוּבָה לַמִּכְתָּב"] },
      { english: "the words are written in Hebrew", hebrew: "הַמִּלִּים כְּתוּבוֹת בְּעִבְרִית", wrong: ["הַמִּלִּים כּוֹתְבוֹת בְּעִבְרִית", "הַמִּלִּים כְּתוּבִים בְּעִבְרִית", "הַמִּלִּים כָּתוּב בְּעִבְרִית"] },
      // ----- More practice (2026-11-12) -----
      // More present tense: I, you, we
      { english: "I write", hebrew: "אֲנִי כּוֹתֵב", wrong: ["אֲנִי כּוֹתֶבֶת", "אֲנִי כּוֹתְבִים", "אֲנִי כָּתַבְתִּי"], f: { hebrew: "אֲנִי כּוֹתֶבֶת", wrong: ["אֲנִי כּוֹתֵב", "אֲנִי כּוֹתְבוֹת", "אֲנִי כָּתַבְתִּי"] } },
      { english: "you (m.) write", hebrew: "אַתָּה כּוֹתֵב", wrong: ["אַתָּה כּוֹתֶבֶת", "אַתָּה כּוֹתְבִים", "אַתָּה כָּתַבְתָּ"] },
      { english: "you (f.) write", hebrew: "אַתְּ כּוֹתֶבֶת", wrong: ["אַתְּ כּוֹתֵב", "אַתְּ כּוֹתְבוֹת", "אַתְּ כָּתַבְתְּ"] },
      { english: "we write", hebrew: "אֲנַחְנוּ כּוֹתְבִים", wrong: ["אֲנַחְנוּ כּוֹתֵב", "אֲנַחְנוּ כָּתַבְנוּ", "אֲנַחְנוּ כְּתוּבִים"], f: { hebrew: "אֲנַחְנוּ כּוֹתְבוֹת", wrong: ["אֲנַחְנוּ כּוֹתֶבֶת", "אֲנַחְנוּ כָּתַבְנוּ", "אֲנַחְנוּ כְּתוּבוֹת"] } },
      // Past and future
      { english: "he wrote", hebrew: "הוּא כָּתַב", wrong: ["הוּא כּוֹתֵב", "הוּא יִכְתֹּב", "הוּא כָּתְבָה"] },
      { english: "she wrote", hebrew: "הִיא כָּתְבָה", wrong: ["הִיא כָּתַב", "הִיא כּוֹתֶבֶת", "הִיא תִּכְתֹּב"] },
      { english: "I wrote", hebrew: "כָּתַבְתִּי", wrong: ["כָּתַבְנוּ", "אֶכְתֹּב", "כָּתַבְתָּ"] },
      { english: "he will write", hebrew: "הוּא יִכְתֹּב", wrong: ["הוּא כָּתַב", "הוּא תִּכְתֹּב", "הוּא יִכְתְּבוּ"] },
      { english: "she will write", hebrew: "הִיא תִּכְתֹּב", wrong: ["הִיא יִכְתֹּב", "הִיא כָּתְבָה", "הִיא תִּכְתְּבִי"] },
      // More describing words: feminine and plural
      { english: "written (f.)", hebrew: "כְּתוּבָה", wrong: ["כּוֹתֶבֶת", "כָּתוּב", "כְּתוּבוֹת"] },
      { english: "written (m. pl.)", hebrew: "כְּתוּבִים", wrong: ["כּוֹתְבִים", "כְּתוּבוֹת", "כָּתוּב"] },
      { english: "written (f. pl.)", hebrew: "כְּתוּבוֹת", wrong: ["כּוֹתְבוֹת", "כְּתוּבִים", "כְּתוּבָה"] },
      { english: "what is written here?", hebrew: "מָה כָּתוּב כָּאן?", wrong: ["מָה כּוֹתֵב כָּאן?", "מָה כְּתוּבָה כָּאן?", "מָה כָּתַב כָּאן?"] },
      { english: "the price is written on the shirt", hebrew: "הַמְּחִיר כָּתוּב עַל הַחֻלְצָה", wrong: ["הַמְּחִיר כְּתוּבָה עַל הַחֻלְצָה", "הַמְּחִיר כּוֹתֵב עַל הַחֻלְצָה", "הַמְּחִיר כָּתוּב לַחֻלְצָה"] },
      { english: "the rules are written on the board", hebrew: "הַחֻקִּים כְּתוּבִים עַל הַלּוּחַ", wrong: ["הַחֻקִּים כְּתוּבוֹת עַל הַלּוּחַ", "הַחֻקִּים כּוֹתְבִים עַל הַלּוּחַ", "הַחֻקִּים כָּתוּב עַל הַלּוּחַ"] },
      { english: "the answers are written in the book", hebrew: "הַתְּשׁוּבוֹת כְּתוּבוֹת בַּסֵּפֶר", wrong: ["הַתְּשׁוּבוֹת כְּתוּבִים בַּסֵּפֶר", "הַתְּשׁוּבוֹת כּוֹתְבוֹת בַּסֵּפֶר", "הַתְּשׁוּבוֹת כְּתוּבָה בַּסֵּפֶר"] },
      // More nouns from the root
      { english: "letters", hebrew: "מִכְתָּבִים", wrong: ["מִכְתָּב", "כַּתָּבִים", "כְּתִיבָה"] },
      { english: "a reporter (f.)", hebrew: "כַּתֶּבֶת", wrong: ["כַּתָּב", "כּוֹתֶבֶת", "כְּתֹבֶת"] },
      { english: "reporters (m.)", hebrew: "כַּתָּבִים", wrong: ["כַּתָּב", "כּוֹתְבִים", "מִכְתָּבִים"] },
      { english: "a news article", hebrew: "כַּתָּבָה", wrong: ["כַּתָּב", "כְּתֹבֶת", "מִכְתָּב"] },
      { english: "what is the address?", hebrew: "מָה הַכְּתֹבֶת?", wrong: ["מָה הַמִּכְתָּב?", "מָה הַכְּתִיבָה?", "מִי הַכְּתֹבֶת?"] },
      // Everyday sentences
      { english: "I write a letter to Grandma", hebrew: "אֲנִי כּוֹתֵב מִכְתָּב לְסַבְתָּא", wrong: ["אֲנִי כּוֹתֵב מִכְתָּב עַל סַבְתָּא", "אֲנִי כּוֹתֵב מִכְתָּב אֶת סַבְתָּא", "אֲנִי כּוֹתֵב כְּתֹבֶת לְסַבְתָּא"], f: { hebrew: "אֲנִי כּוֹתֶבֶת מִכְתָּב לְסַבְתָּא", wrong: ["אֲנִי כּוֹתֶבֶת מִכְתָּב עַל סַבְתָּא", "אֲנִי כּוֹתֶבֶת מִכְתָּב אֶת סַבְתָּא", "אֲנִי כּוֹתֶבֶת כְּתֹבֶת לְסַבְתָּא"] } },
      { english: "we write the words in the notebook", hebrew: "אֲנַחְנוּ כּוֹתְבִים אֶת הַמִּלִּים בַּמַּחְבֶּרֶת", wrong: ["אֲנַחְנוּ כּוֹתְבִים הַמִּלִּים בַּמַּחְבֶּרֶת", "אֲנַחְנוּ כּוֹתְבִים אֶת הַמִּלִּים לַמַּחְבֶּרֶת", "אֲנַחְנוּ כְּתוּבִים אֶת הַמִּלִּים בַּמַּחְבֶּרֶת"], f: { hebrew: "אֲנַחְנוּ כּוֹתְבוֹת אֶת הַמִּלִּים בַּמַּחְבֶּרֶת", wrong: ["אֲנַחְנוּ כּוֹתְבוֹת הַמִּלִּים בַּמַּחְבֶּרֶת", "אֲנַחְנוּ כּוֹתְבוֹת אֶת הַמִּלִּים לַמַּחְבֶּרֶת", "אֲנַחְנוּ כְּתוּבוֹת אֶת הַמִּלִּים בַּמַּחְבֶּרֶת"] } },
      { english: "yesterday I wrote a letter", hebrew: "אֶתְמוֹל כָּתַבְתִּי מִכְתָּב", wrong: ["אֶתְמוֹל אֶכְתֹּב מִכְתָּב", "אֶתְמוֹל כָּתַבְנוּ מִכְתָּב", "אֶתְמוֹל כָּתַבְתִּי כְּתֹבֶת"] },
      { english: "tomorrow she will write the article", hebrew: "מָחָר הִיא תִּכְתֹּב אֶת הַכַּתָּבָה", wrong: ["מָחָר הִיא כָּתְבָה אֶת הַכַּתָּבָה", "מָחָר הִיא תִּכְתֹּב הַכַּתָּבָה", "מָחָר הִיא תִּכְתֹּב אֶת הַכַּתָּב"] },
      { english: "now she is writing the homework", hebrew: "עַכְשָׁו הִיא כּוֹתֶבֶת אֶת שִׁעוּרֵי הַבַּיִת", wrong: ["עַכְשָׁו הִיא כָּתְבָה אֶת שִׁעוּרֵי הַבַּיִת", "עַכְשָׁו הִיא כּוֹתֶבֶת שִׁעוּרֵי הַבַּיִת", "עַכְשָׁו הִיא כּוֹתֵב אֶת שִׁעוּרֵי הַבַּיִת"] },
      { english: "he wrote it (the letter) yesterday", hebrew: "הוּא כָּתַב אוֹתוֹ אֶתְמוֹל", wrong: ["הוּא כָּתַב אוֹתָהּ אֶתְמוֹל", "הוּא כָּתַב לוֹ אֶתְמוֹל", "הוּא כּוֹתֵב אוֹתוֹ אֶתְמוֹל"] },
      { english: "she wrote it (the address) on the paper", hebrew: "הִיא כָּתְבָה אוֹתָהּ עַל הַדַּף", wrong: ["הִיא כָּתְבָה אוֹתוֹ עַל הַדַּף", "הִיא כָּתְבָה לָהּ עַל הַדַּף", "הִיא כָּתְבָה אוֹתָהּ לַדַּף"] },
      { english: "what are you (m.) writing?", hebrew: "מָה אַתָּה כּוֹתֵב?", wrong: ["מָה אַתָּה כּוֹתֶבֶת?", "מָה אַתָּה כָּתוּב?", "עַל מָה אַתָּה כּוֹתֵב?"] },
      { english: "what are you (f.) writing about?", hebrew: "עַל מָה אַתְּ כּוֹתֶבֶת?", wrong: ["מָה אַתְּ כּוֹתֶבֶת?", "עִם מָה אַתְּ כּוֹתֶבֶת?", "עַל מָה אַתְּ כּוֹתֵב?"] },
      { english: "the teacher (f.) writes the date on the board", hebrew: "הַמּוֹרָה כּוֹתֶבֶת אֶת הַתַּאֲרִיךְ עַל הַלּוּחַ", wrong: ["הַמּוֹרָה כּוֹתֶבֶת הַתַּאֲרִיךְ עַל הַלּוּחַ", "הַמּוֹרָה כּוֹתֶבֶת אֶת הַתַּאֲרִיךְ לַלּוּחַ", "הַמּוֹרָה כְּתוּבָה אֶת הַתַּאֲרִיךְ עַל הַלּוּחַ"] },
      { english: "the reporter (f.) writes an article about the school", hebrew: "הַכַּתֶּבֶת כּוֹתֶבֶת כַּתָּבָה עַל בֵּית הַסֵּפֶר", wrong: ["הַכַּתֶּבֶת כּוֹתֶבֶת כַּתָּבָה לְבֵית הַסֵּפֶר", "הַכַּתָּב כּוֹתֶבֶת כַּתָּבָה עַל בֵּית הַסֵּפֶר", "הַכַּתֶּבֶת כּוֹתֶבֶת מִכְתָּב עַל בֵּית הַסֵּפֶר"] },
      { english: "I'm writing to you (m.) from the trip", hebrew: "אֲנִי כּוֹתֵב לְךָ מֵהַטִּיּוּל", wrong: ["אֲנִי כּוֹתֵב אוֹתְךָ מֵהַטִּיּוּל", "אֲנִי כּוֹתֵב עָלֶיךָ מֵהַטִּיּוּל", "אֲנִי כּוֹתֵב לְךָ לַטִּיּוּל"], f: { hebrew: "אֲנִי כּוֹתֶבֶת לְךָ מֵהַטִּיּוּל", wrong: ["אֲנִי כּוֹתֶבֶת אוֹתְךָ מֵהַטִּיּוּל", "אֲנִי כּוֹתֶבֶת עָלֶיךָ מֵהַטִּיּוּל", "אֲנִי כּוֹתֶבֶת לְךָ לַטִּיּוּל"] } },
      { english: "I will write to you (f.) tomorrow", hebrew: "אֶכְתֹּב לָךְ מָחָר", wrong: ["כָּתַבְתִּי לָךְ מָחָר", "אֶכְתֹּב אוֹתָךְ מָחָר", "אֶכְתֹּב לְךָ מָחָר"] },
      { english: "the letter that he will write", hebrew: "הַמִּכְתָּב שֶׁהוּא יִכְתֹּב", wrong: ["הַמִּכְתָּב שֶׁהוּא כָּתַב", "הַמִּכְתָּב שֶׁהוּא כָּתוּב", "הַמִּכְתָּב שֶׁהוּא תִּכְתֹּב"] },
      { english: "the students (m.) write a story together", hebrew: "הַתַּלְמִידִים כּוֹתְבִים סִפּוּר בְּיַחַד", wrong: ["הַתַּלְמִידִים כּוֹתְבוֹת סִפּוּר בְּיַחַד", "הַתַּלְמִידִים כְּתוּבִים סִפּוּר בְּיַחַד", "הַתַּלְמִידִים כּוֹתֵב סִפּוּר בְּיַחַד"] },
    ],
  },
  {
    // ל־מ־ד has two verbs in two patterns: לִלְמֹד (learn, פָּעַל) here, לְלַמֵּד (teach, פִּעֵל) in "root-lmd-teach".
    id: "root-lmd", kind: "root", pattern: "paal", icon: "🌱", english: "Root ל־מ־ד: learn", hebrew: "שֹׁרֶשׁ ל־מ־ד: לִלְמֹד",
    words: [
      { english: "to learn", hebrew: "לִלְמֹד", wrong: ["לְלַמֵּד", "לוֹמֵד", "תַּלְמִיד"] },
      { english: "he learns", hebrew: "הוּא לוֹמֵד", wrong: ["הוּא מְלַמֵּד", "הוּא לוֹמֶדֶת", "הוּא לָמַד"] },
      { english: "she learns", hebrew: "הִיא לוֹמֶדֶת", wrong: ["הִיא מְלַמֶּדֶת", "הִיא לוֹמֵד", "הִיא לָמְדָה"] },
      { english: "they (m.) learn", hebrew: "הֵם לוֹמְדִים", wrong: ["הֵם מְלַמְּדִים", "הֵם לוֹמְדוֹת", "הֵם לוֹמֵד"] },
      { english: "a student (m.)", hebrew: "תַּלְמִיד", wrong: ["מְלַמֵּד", "לִמּוּדִים", "תַּלְמִידָה"] },
      { english: "studies", hebrew: "לִמּוּדִים", wrong: ["תַּלְמִידִים", "לוֹמְדִים", "מְלַמְּדִים"] },
      // לוֹמֵד + (a subject, no אֶת) / בְּ (where, or in which language) / עַל (about) / מִ (from whom) / an infinitive
      { english: "he learns Hebrew", hebrew: "הוּא לוֹמֵד עִבְרִית", wrong: ["הוּא לוֹמֵד אֶת עִבְרִית", "הוּא לוֹמֵד בְּעִבְרִית", "הוּא מְלַמֵּד עִבְרִית"] },
      { english: "he learns in Hebrew", hebrew: "הוּא לוֹמֵד בְּעִבְרִית", wrong: ["הוּא לוֹמֵד עִבְרִית", "הוּא לוֹמֵד לְעִבְרִית", "הוּא לוֹמֵד מֵעִבְרִית"] },
      { english: "she learns about Israel", hebrew: "הִיא לוֹמֶדֶת עַל יִשְׂרָאֵל", wrong: ["הִיא לוֹמֶדֶת בְּיִשְׂרָאֵל", "הִיא לוֹמֶדֶת אֶת יִשְׂרָאֵל", "הִיא לוֹמֶדֶת לְיִשְׂרָאֵל"] },
      { english: "she learns in Israel", hebrew: "הִיא לוֹמֶדֶת בְּיִשְׂרָאֵל", wrong: ["הִיא לוֹמֶדֶת עַל יִשְׂרָאֵל", "הִיא לוֹמֶדֶת לְיִשְׂרָאֵל", "הִיא לוֹמֶדֶת מִיִּשְׂרָאֵל"] },
      { english: "she learns from the teacher (m.)", hebrew: "הִיא לוֹמֶדֶת מֵהַמּוֹרֶה", wrong: ["הִיא לוֹמֶדֶת לַמּוֹרֶה", "הִיא לוֹמֶדֶת אֶת הַמּוֹרֶה", "הִיא לוֹמֶדֶת עַל הַמּוֹרֶה"] },
      { english: "he learns to swim", hebrew: "הוּא לוֹמֵד לִשְׂחוֹת", wrong: ["הוּא לוֹמֵד שׂוֹחֶה", "הוּא לוֹמֵד אֶת לִשְׂחוֹת", "הוּא מְלַמֵּד לִשְׂחוֹת"] },
      { english: "I learn", hebrew: "אֲנִי לוֹמֵד", wrong: ["אֲנִי לוֹמֶדֶת", "אֲנִי מְלַמֵּד", "אֲנִי לָמַדְתִּי"], f: { hebrew: "אֲנִי לוֹמֶדֶת", wrong: ["אֲנִי לוֹמֵד", "אֲנִי מְלַמֶּדֶת", "אֲנִי לָמַדְתִּי"] } },
      { english: "you (m.) learn", hebrew: "אַתָּה לוֹמֵד", wrong: ["אַתָּה לוֹמֶדֶת", "אַתָּה מְלַמֵּד", "אַתָּה לָמַדְתָּ"] },
      { english: "you (f.) learn", hebrew: "אַתְּ לוֹמֶדֶת", wrong: ["אַתְּ לוֹמֵד", "אַתְּ מְלַמֶּדֶת", "אַתְּ לָמַדְתְּ"] },
      { english: "we learn", hebrew: "אֲנַחְנוּ לוֹמְדִים", wrong: ["אֲנַחְנוּ מְלַמְּדִים", "אֲנַחְנוּ לוֹמֵד", "אֲנַחְנוּ לָמַדְנוּ"], f: { hebrew: "אֲנַחְנוּ לוֹמְדוֹת", wrong: ["אֲנַחְנוּ מְלַמְּדוֹת", "אֲנַחְנוּ לוֹמֶדֶת", "אֲנַחְנוּ לָמַדְנוּ"] } },
      { english: "they (f.) learn", hebrew: "הֵן לוֹמְדוֹת", wrong: ["הֵן לוֹמְדִים", "הֵן מְלַמְּדוֹת", "הֵן לוֹמֶדֶת"] },
      { english: "he learned", hebrew: "הוּא לָמַד", wrong: ["הוּא לִמֵּד", "הוּא לוֹמֵד", "הוּא יִלְמַד"] },
      { english: "I learned", hebrew: "לָמַדְתִּי", wrong: ["לִמַּדְתִּי", "אֶלְמַד", "לָמַדְנוּ"] },
      { english: "she will learn", hebrew: "הִיא תִּלְמַד", wrong: ["הִיא יִלְמַד", "הִיא לָמְדָה", "הִיא תְּלַמֵּד"] },
      { english: "a student (f.)", hebrew: "תַּלְמִידָה", wrong: ["תַּלְמִיד", "מְלַמֶּדֶת", "תַּלְמִידוֹת"] },
      { english: "students (m.)", hebrew: "תַּלְמִידִים", wrong: ["תַּלְמִיד", "לִמּוּדִים", "תַּלְמִידוֹת"] },
      { english: "the school year", hebrew: "שְׁנַת הַלִּמּוּדִים", wrong: ["שְׁנַת הַתַּלְמִידִים", "שְׁנַת הַלּוֹמְדִים", "שָׁנָה הַלִּמּוּדִים"] },
      { english: "I learn math at school", hebrew: "אֲנִי לוֹמֵד מָתֵמָטִיקָה בְּבֵית הַסֵּפֶר", wrong: ["אֲנִי לוֹמֵד אֶת מָתֵמָטִיקָה בְּבֵית הַסֵּפֶר", "אֲנִי מְלַמֵּד מָתֵמָטִיקָה בְּבֵית הַסֵּפֶר", "אֲנִי לוֹמֵד מָתֵמָטִיקָה לְבֵית הַסֵּפֶר"], f: { hebrew: "אֲנִי לוֹמֶדֶת מָתֵמָטִיקָה בְּבֵית הַסֵּפֶר", wrong: ["אֲנִי לוֹמֶדֶת אֶת מָתֵמָטִיקָה בְּבֵית הַסֵּפֶר", "אֲנִי מְלַמֶּדֶת מָתֵמָטִיקָה בְּבֵית הַסֵּפֶר", "אֲנִי לוֹמֶדֶת מָתֵמָטִיקָה לְבֵית הַסֵּפֶר"] } },
      { english: "we study for the test", hebrew: "אֲנַחְנוּ לוֹמְדִים לַמִּבְחָן", wrong: ["אֲנַחְנוּ לוֹמְדִים אֶת הַמִּבְחָן", "אֲנַחְנוּ לוֹמְדִים עַל הַמִּבְחָן", "אֲנַחְנוּ מְלַמְּדִים לַמִּבְחָן"], f: { hebrew: "אֲנַחְנוּ לוֹמְדוֹת לַמִּבְחָן", wrong: ["אֲנַחְנוּ לוֹמְדוֹת אֶת הַמִּבְחָן", "אֲנַחְנוּ לוֹמְדוֹת עַל הַמִּבְחָן", "אֲנַחְנוּ מְלַמְּדוֹת לַמִּבְחָן"] } },
      { english: "I want to learn Arabic", hebrew: "אֲנִי רוֹצֶה לִלְמֹד עֲרָבִית", wrong: ["אֲנִי רוֹצֶה לְלַמֵּד עֲרָבִית", "אֲנִי רוֹצֶה לוֹמֵד עֲרָבִית", "אֲנִי רוֹצֶה לִלְמֹד אֶת עֲרָבִית"], f: { hebrew: "אֲנִי רוֹצָה לִלְמֹד עֲרָבִית", wrong: ["אֲנִי רוֹצָה לְלַמֵּד עֲרָבִית", "אֲנִי רוֹצָה לוֹמֶדֶת עֲרָבִית", "אֲנִי רוֹצָה לִלְמֹד אֶת עֲרָבִית"] } },
      { english: "the students (m.) study in the library", hebrew: "הַתַּלְמִידִים לוֹמְדִים בַּסִּפְרִיָּה", wrong: ["הַתַּלְמִידִים לוֹמְדִים לַסִּפְרִיָּה", "הַתַּלְמִידִים מְלַמְּדִים בַּסִּפְרִיָּה", "הַתַּלְמִידִים לוֹמְדוֹת בַּסִּפְרִיָּה"] },
      { english: "she studies at the university", hebrew: "הִיא לוֹמֶדֶת בָּאוּנִיבֶרְסִיטָה", wrong: ["הִיא לוֹמֶדֶת לָאוּנִיבֶרְסִיטָה", "הִיא מְלַמֶּדֶת בָּאוּנִיבֶרְסִיטָה", "הִיא לוֹמֶדֶת אֶת הָאוּנִיבֶרְסִיטָה"] },
      { english: "yesterday we learned about the Golan", hebrew: "אֶתְמוֹל לָמַדְנוּ עַל הַגּוֹלָן", wrong: ["אֶתְמוֹל נִלְמַד עַל הַגּוֹלָן", "אֶתְמוֹל לָמַדְנוּ בַּגּוֹלָן", "אֶתְמוֹל לִמַּדְנוּ עַל הַגּוֹלָן"] },
      { english: "tomorrow I will study with Dana", hebrew: "מָחָר אֶלְמַד עִם דָּנָה", wrong: ["מָחָר לָמַדְתִּי עִם דָּנָה", "מָחָר אֲלַמֵּד עִם דָּנָה", "מָחָר אֶלְמַד עַל דָּנָה"] },
      { english: "what did you (m.) learn today?", hebrew: "מָה לָמַדְתָּ הַיּוֹם?", wrong: ["מָה לִמַּדְתָּ הַיּוֹם?", "מָה לָמַדְתְּ הַיּוֹם?", "מָה תִּלְמַד הַיּוֹם?"] },
      { english: "he learned it (the song) from his grandfather", hebrew: "הוּא לָמַד אוֹתוֹ מִסַּבָּא שֶׁלּוֹ", wrong: ["הוּא לָמַד אוֹתוֹ לְסַבָּא שֶׁלּוֹ", "הוּא לִמֵּד אוֹתוֹ מִסַּבָּא שֶׁלּוֹ", "הוּא לָמַד אוֹתָהּ מִסַּבָּא שֶׁלּוֹ"] },
      { english: "the studies are hard this year", hebrew: "הַלִּמּוּדִים קָשִׁים הַשָּׁנָה", wrong: ["הַלִּמּוּדִים קָשׁוֹת הַשָּׁנָה", "הַלִּמּוּדִים קָשֶׁה הַשָּׁנָה", "הַתַּלְמִידִים קָשִׁים הַשָּׁנָה"] },
      { english: "the school year starts in September", hebrew: "שְׁנַת הַלִּמּוּדִים מַתְחִילָה בְּסֶפְּטֶמְבֶּר", wrong: ["שְׁנַת הַלִּמּוּדִים מַתְחִיל בְּסֶפְּטֶמְבֶּר", "שְׁנַת הַתַּלְמִידִים מַתְחִילָה בְּסֶפְּטֶמְבֶּר", "שְׁנַת הַלִּמּוּדִים מַתְחִילָה לְסֶפְּטֶמְבֶּר"] },
    ],
  },
  {
    // לְלַמֵּד (teach) is the פִּעֵל pattern of ל־מ־ד. The wrong answers often use לִלְמֹד (learn), so the two don't get mixed up.
    id: "root-lmd-teach", kind: "root", pattern: "piel", icon: "🌱", english: "Root ל־מ־ד: teach", hebrew: "שֹׁרֶשׁ ל־מ־ד: לְלַמֵּד",
    words: [
      // The describing word from the root (מְלֻמָּד = educated) vs. the action (מְלַמֵּד = teaches)
      { english: "to teach", hebrew: "לְלַמֵּד", wrong: ["לִלְמֹד", "מְלַמֵּד", "מוֹרֶה"] },
      { english: "she teaches", hebrew: "הִיא מְלַמֶּדֶת", wrong: ["הִיא לוֹמֶדֶת", "הִיא מְלַמֵּד", "הִיא לִמְּדָה"] },
      { english: "they (f.) teach", hebrew: "הֵן מְלַמְּדוֹת", wrong: ["הֵן לוֹמְדוֹת", "הֵן מְלַמְּדִים", "הֵן מְלַמֶּדֶת"] },
      { english: "the teacher (f.) teaches the class", hebrew: "הַמּוֹרָה מְלַמֶּדֶת אֶת הַכִּתָּה", wrong: ["הַמּוֹרָה לוֹמֶדֶת אֶת הַכִּתָּה", "הַמּוֹרָה מְלַמֶּדֶת לַכִּתָּה", "הַמּוֹרָה מְלַמֶּדֶת הַכִּתָּה"] },
      { english: "educated, learned (m.)", hebrew: "מְלֻמָּד", wrong: ["מְלַמֵּד", "לוֹמֵד", "מְלֻמֶּדֶת"] },
      { english: "she is a very educated woman", hebrew: "הִיא אִשָּׁה מְלֻמֶּדֶת מְאוֹד", wrong: ["הִיא אִשָּׁה מְלַמֶּדֶת מְאוֹד", "הִיא אִשָּׁה מְלֻמָּד מְאוֹד", "הִיא אִשָּׁה לוֹמֶדֶת מְאוֹד"] },
      { english: "I teach", hebrew: "אֲנִי מְלַמֵּד", wrong: ["אֲנִי מְלַמֶּדֶת", "אֲנִי לוֹמֵד", "אֲנִי מְלֻמָּד"], f: { hebrew: "אֲנִי מְלַמֶּדֶת", wrong: ["אֲנִי מְלַמֵּד", "אֲנִי לוֹמֶדֶת", "אֲנִי מְלֻמֶּדֶת"] } },
      { english: "he teaches", hebrew: "הוּא מְלַמֵּד", wrong: ["הוּא לוֹמֵד", "הוּא מְלַמֶּדֶת", "הוּא לִמֵּד"] },
      { english: "she taught", hebrew: "הִיא לִמְּדָה", wrong: ["הִיא לָמְדָה", "הִיא מְלַמֶּדֶת", "הִיא לִמֵּד"] },
      { english: "he will teach", hebrew: "הוּא יְלַמֵּד", wrong: ["הוּא יִלְמַד", "הוּא לִמֵּד", "הוּא תְּלַמֵּד"] },
      { english: "educated (f.)", hebrew: "מְלֻמֶּדֶת", wrong: ["מְלַמֶּדֶת", "מְלֻמָּד", "לוֹמֶדֶת"] },
      { english: "educated (m. pl.)", hebrew: "מְלֻמָּדִים", wrong: ["מְלַמְּדִים", "מְלֻמָּדוֹת", "לוֹמְדִים"] },
      { english: "educated (f. pl.)", hebrew: "מְלֻמָּדוֹת", wrong: ["מְלַמְּדוֹת", "מְלֻמָּדִים", "מְלֻמֶּדֶת"] },
      { english: "he is an educated man", hebrew: "הוּא אִישׁ מְלֻמָּד", wrong: ["הוּא אִישׁ מְלַמֵּד", "הוּא אִישׁ מְלֻמֶּדֶת", "הוּא אִישׁ לוֹמֵד"] },
      { english: "they are educated people", hebrew: "הֵם אֲנָשִׁים מְלֻמָּדִים", wrong: ["הֵם אֲנָשִׁים מְלַמְּדִים", "הֵם אֲנָשִׁים מְלֻמָּדוֹת", "הֵם אֲנָשִׁים מְלֻמָּד"] },
      { english: "the teacher (m.) teaches us Hebrew", hebrew: "הַמּוֹרֶה מְלַמֵּד אוֹתָנוּ עִבְרִית", wrong: ["הַמּוֹרֶה לוֹמֵד אוֹתָנוּ עִבְרִית", "הַמּוֹרֶה מְלַמֵּד אוֹתָנוּ אֶת עִבְרִית", "הַמּוֹרֶה מְלַמֵּד אוֹתָם עִבְרִית"] },
      { english: "she teaches him to read", hebrew: "הִיא מְלַמֶּדֶת אוֹתוֹ לִקְרֹא", wrong: ["הִיא לוֹמֶדֶת אוֹתוֹ לִקְרֹא", "הִיא מְלַמֶּדֶת אוֹתָהּ לִקְרֹא", "הִיא מְלַמֶּדֶת אוֹתוֹ קוֹרֵא"] },
      { english: "Dad teaches me to cook", hebrew: "אַבָּא מְלַמֵּד אוֹתִי לְבַשֵּׁל", wrong: ["אַבָּא לוֹמֵד אוֹתִי לְבַשֵּׁל", "אַבָּא מְלַמֵּד אוֹתִי מְבַשֵּׁל", "אַבָּא מְלַמֵּד אוֹתָנוּ לְבַשֵּׁל"] },
      { english: "who teaches English?", hebrew: "מִי מְלַמֵּד אַנְגְּלִית?", wrong: ["מִי לוֹמֵד אַנְגְּלִית?", "מִי מְלַמֵּד אֶת אַנְגְּלִית?", "מִי מְלֻמָּד אַנְגְּלִית?"] },
    ],
  },
  {
    id: "root-dbr", kind: "root", pattern: "piel", icon: "🌱", english: "Root ד־ב־ר: speak", hebrew: "שֹׁרֶשׁ ד־ב־ר: לְדַבֵּר",
    words: [
      { english: "to speak, to talk", hebrew: "לְדַבֵּר", wrong: ["מְדַבֵּר", "דָּבָר", "לְסַפֵּר"] },
      { english: "he speaks", hebrew: "הוּא מְדַבֵּר", wrong: ["הוּא מְדַבֶּרֶת", "הוּא מְדַבְּרִים", "הוּא דִּבֵּר"] },
      { english: "she speaks", hebrew: "הִיא מְדַבֶּרֶת", wrong: ["הִיא מְדַבֵּר", "הִיא מְדַבְּרוֹת", "הִיא דִּבְּרָה"] },
      { english: "they (m.) speak", hebrew: "הֵם מְדַבְּרִים", wrong: ["הֵם מְדַבְּרוֹת", "הֵם מְדַבֵּר", "הֵם דִּבְּרוּ"] },
      { english: "they (f.) speak", hebrew: "הֵן מְדַבְּרוֹת", wrong: ["הֵן מְדַבְּרִים", "הֵן מְדַבֶּרֶת", "הֵן דִּבְּרוּ"] },
      { english: "a thing", hebrew: "דָּבָר", wrong: ["דִּבּוּר", "דְּבָרִים", "דּוֹבֵר"] },
      { english: "things", hebrew: "דְּבָרִים", wrong: ["דָּבָר", "מְדַבְּרִים", "דִּבּוּרִים"] },
      { english: "speech, talking", hebrew: "דִּבּוּר", wrong: ["דָּבָר", "דּוֹבֵר", "מְדַבֵּר"] },
      { english: "a spokesperson (m.)", hebrew: "דּוֹבֵר", wrong: ["דִּבּוּר", "דָּבָר", "דּוֹבֶרֶת"] },
      // מְדַבֵּר + עִם (with someone) / עַל (about) / אֶל (to) / בְּ (on the phone, in a language) / a language
      { english: "he talks with Dana", hebrew: "הוּא מְדַבֵּר עִם דָּנָה", wrong: ["הוּא מְדַבֵּר עַל דָּנָה", "הוּא מְדַבֵּר אֶת דָּנָה", "הוּא מְדַבֵּר בְּדָנָה"] },
      { english: "he talks about Dana", hebrew: "הוּא מְדַבֵּר עַל דָּנָה", wrong: ["הוּא מְדַבֵּר עִם דָּנָה", "הוּא מְדַבֵּר אֶת דָּנָה", "הוּא מְדַבֵּר מִדָּנָה"] },
      { english: "she talks to the class", hebrew: "הִיא מְדַבֶּרֶת אֶל הַכִּתָּה", wrong: ["הִיא מְדַבֶּרֶת אֶת הַכִּתָּה", "הִיא מְדַבֶּרֶת עַל הַכִּתָּה", "הִיא מְדַבֶּרֶת מֵהַכִּתָּה"] },
      { english: "she speaks Hebrew", hebrew: "הִיא מְדַבֶּרֶת עִבְרִית", wrong: ["הִיא מְדַבֶּרֶת אֶת עִבְרִית", "הִיא מְדַבֶּרֶת עִם עִבְרִית", "הִיא מְדַבֶּרֶת לְעִבְרִית"] },
      { english: "they (m.) talk on the phone", hebrew: "הֵם מְדַבְּרִים בַּטֶּלֶפוֹן", wrong: ["הֵם מְדַבְּרִים עַל הַטֶּלֶפוֹן", "הֵם מְדַבְּרִים לַטֶּלֶפוֹן", "הֵם מְדַבְּרִים אֶת הַטֶּלֶפוֹן"] },
      { english: "they (m.) talk about the phone", hebrew: "הֵם מְדַבְּרִים עַל הַטֶּלֶפוֹן", wrong: ["הֵם מְדַבְּרִים בַּטֶּלֶפוֹן", "הֵם מְדַבְּרִים עִם הַטֶּלֶפוֹן", "הֵם מְדַבְּרִים אֶת הַטֶּלֶפוֹן"] },
      // The describing word from the root (מְדֻבָּר = being talked about, agreed) vs. the action (מְדַבֵּר = speaks)
      { english: "it's a deal! (agreed)", hebrew: "מְדֻבָּר!", wrong: ["מְדַבֵּר!", "דַּבֵּר!", "דָּבָר!"] },
      { english: "what is it about?", hebrew: "עַל מָה מְדֻבָּר?", wrong: ["עַל מָה מְדַבֵּר?", "עִם מָה מְדֻבָּר?", "עַל מָה מְדֻבֶּרֶת?"] },
      // ----- More practice (2026-11-12) -----
      // More present tense: I, you, we
      { english: "I speak", hebrew: "אֲנִי מְדַבֵּר", wrong: ["אֲנִי מְדַבֶּרֶת", "אֲנִי מְדַבְּרִים", "אֲנִי דִּבַּרְתִּי"], f: { hebrew: "אֲנִי מְדַבֶּרֶת", wrong: ["אֲנִי מְדַבֵּר", "אֲנִי מְדַבְּרוֹת", "אֲנִי דִּבַּרְתִּי"] } },
      { english: "you (m.) speak", hebrew: "אַתָּה מְדַבֵּר", wrong: ["אַתָּה מְדַבֶּרֶת", "אַתָּה דִּבַּרְתָּ", "אַתָּה מְדֻבָּר"] },
      { english: "you (f.) speak", hebrew: "אַתְּ מְדַבֶּרֶת", wrong: ["אַתְּ מְדַבֵּר", "אַתְּ דִּבַּרְתְּ", "אַתְּ מְדַבְּרוֹת"] },
      { english: "we speak", hebrew: "אֲנַחְנוּ מְדַבְּרִים", wrong: ["אֲנַחְנוּ מְדַבֵּר", "אֲנַחְנוּ דִּבַּרְנוּ", "אֲנַחְנוּ נְדַבֵּר"], f: { hebrew: "אֲנַחְנוּ מְדַבְּרוֹת", wrong: ["אֲנַחְנוּ מְדַבֶּרֶת", "אֲנַחְנוּ דִּבַּרְנוּ", "אֲנַחְנוּ נְדַבֵּר"] } },
      // Past and future
      { english: "he spoke", hebrew: "הוּא דִּבֵּר", wrong: ["הוּא מְדַבֵּר", "הוּא יְדַבֵּר", "הוּא דִּבְּרָה"] },
      { english: "she spoke", hebrew: "הִיא דִּבְּרָה", wrong: ["הִיא דִּבֵּר", "הִיא מְדַבֶּרֶת", "הִיא תְּדַבֵּר"] },
      { english: "I will speak", hebrew: "אֲדַבֵּר", wrong: ["דִּבַּרְתִּי", "נְדַבֵּר", "יְדַבֵּר"] },
      { english: "she will speak", hebrew: "הִיא תְּדַבֵּר", wrong: ["הִיא יְדַבֵּר", "הִיא דִּבְּרָה", "הִיא תְּדַבְּרִי"] },
      { english: "they will speak", hebrew: "הֵם יְדַבְּרוּ", wrong: ["הֵם דִּבְּרוּ", "הֵם יְדַבֵּר", "הֵם מְדַבְּרִים"] },
      // The describing word מְדֻבָּר (spoken) in all four forms
      { english: "spoken (m.)", hebrew: "מְדֻבָּר", wrong: ["מְדַבֵּר", "דָּבָר", "מְדֻבֶּרֶת"] },
      { english: "spoken (f.)", hebrew: "מְדֻבֶּרֶת", wrong: ["מְדַבֶּרֶת", "מְדֻבָּר", "מְדֻבָּרוֹת"] },
      { english: "spoken (m. pl.)", hebrew: "מְדֻבָּרִים", wrong: ["מְדַבְּרִים", "מְדֻבָּרוֹת", "דְּבָרִים"] },
      { english: "spoken (f. pl.)", hebrew: "מְדֻבָּרוֹת", wrong: ["מְדַבְּרוֹת", "מְדֻבָּרִים", "מְדֻבֶּרֶת"] },
      { english: "spoken Hebrew", hebrew: "עִבְרִית מְדֻבֶּרֶת", wrong: ["עִבְרִית מְדַבֶּרֶת", "עִבְרִית מְדֻבָּר", "עִבְרִית מְדַבֵּר"] },
      { english: "Hebrew is a spoken language", hebrew: "עִבְרִית הִיא שָׂפָה מְדֻבֶּרֶת", wrong: ["עִבְרִית הִיא שָׂפָה מְדַבֶּרֶת", "עִבְרִית הִיא שָׂפָה מְדֻבָּר", "עִבְרִית הִיא שָׂפָה מְדֻבָּרוֹת"] },
      { english: "these are spoken languages", hebrew: "אֵלֶּה שָׂפוֹת מְדֻבָּרוֹת", wrong: ["אֵלֶּה שָׂפוֹת מְדַבְּרוֹת", "אֵלֶּה שָׂפוֹת מְדֻבָּרִים", "אֵלֶּה שָׂפוֹת מְדֻבֶּרֶת"] },
      // More nouns from the root (and the desert, which has the same letters)
      { english: "a spokeswoman", hebrew: "דּוֹבֶרֶת", wrong: ["דּוֹבֵר", "מְדַבֶּרֶת", "דִּבּוּר"] },
      { english: "lots of things", hebrew: "הַרְבֵּה דְּבָרִים", wrong: ["הַרְבֵּה דָּבָר", "הַרְבֵּה דִּבּוּרִים", "הַרְבֵּה מְדַבְּרִים"] },
      { english: "nothing (not a thing)", hebrew: "שׁוּם דָּבָר", wrong: ["שׁוּם דְּבָרִים", "שׁוּם דִּבּוּר", "כָּל דָּבָר"] },
      { english: "I bought a few things at the store", hebrew: "קָנִיתִי כַּמָּה דְּבָרִים בַּחֲנוּת", wrong: ["קָנִיתִי כַּמָּה דָּבָר בַּחֲנוּת", "קָנִיתִי כַּמָּה דִּבּוּרִים בַּחֲנוּת", "קָנִיתִי כַּמָּה דְּבָרִים לַחֲנוּת"] },
      // Everyday sentences
      { english: "I talk with my friends", hebrew: "אֲנִי מְדַבֵּר עִם הַחֲבֵרִים שֶׁלִּי", wrong: ["אֲנִי מְדַבֵּר עַל הַחֲבֵרִים שֶׁלִּי", "אֲנִי מְדַבֵּר אֶת הַחֲבֵרִים שֶׁלִּי", "אֲנִי מְדַבֶּרֶת עִם הַחֲבֵרִים שֶׁלִּי"], f: { hebrew: "אֲנִי מְדַבֶּרֶת עִם הַחֲבֵרִים שֶׁלִּי", wrong: ["אֲנִי מְדַבֶּרֶת עַל הַחֲבֵרִים שֶׁלִּי", "אֲנִי מְדַבֶּרֶת אֶת הַחֲבֵרִים שֶׁלִּי", "אֲנִי מְדַבֵּר עִם הַחֲבֵרִים שֶׁלִּי"] } },
      { english: "we talk about the trip", hebrew: "אֲנַחְנוּ מְדַבְּרִים עַל הַטִּיּוּל", wrong: ["אֲנַחְנוּ מְדַבְּרִים עִם הַטִּיּוּל", "אֲנַחְנוּ מְדַבְּרִים לַטִּיּוּל", "אֲנַחְנוּ מְדַבְּרִים אֶת הַטִּיּוּל"], f: { hebrew: "אֲנַחְנוּ מְדַבְּרוֹת עַל הַטִּיּוּל", wrong: ["אֲנַחְנוּ מְדַבְּרוֹת עִם הַטִּיּוּל", "אֲנַחְנוּ מְדַבְּרוֹת לַטִּיּוּל", "אֲנַחְנוּ מְדַבְּרוֹת אֶת הַטִּיּוּל"] } },
      { english: "do you (m.) speak English?", hebrew: "אַתָּה מְדַבֵּר אַנְגְּלִית?", wrong: ["אַתָּה מְדַבֵּר אֶת אַנְגְּלִית?", "אַתָּה מְדַבֵּר עִם אַנְגְּלִית?", "אַתָּה מְדַבֶּרֶת אַנְגְּלִית?"] },
      { english: "what are you (f.) talking about?", hebrew: "עַל מָה אַתְּ מְדַבֶּרֶת?", wrong: ["עִם מָה אַתְּ מְדַבֶּרֶת?", "עַל מָה אַתְּ מְדַבֵּר?", "עַל מָה אַתְּ מְדֻבֶּרֶת?"] },
      { english: "who are you (m.) talking with?", hebrew: "עִם מִי אַתָּה מְדַבֵּר?", wrong: ["עַל מִי אַתָּה מְדַבֵּר?", "אֶת מִי אַתָּה מְדַבֵּר?", "עִם מִי אַתָּה מְדֻבָּר?"] },
      { english: "yesterday I talked with Grandma", hebrew: "אֶתְמוֹל דִּבַּרְתִּי עִם סַבְתָּא", wrong: ["אֶתְמוֹל אֲדַבֵּר עִם סַבְתָּא", "אֶתְמוֹל דִּבַּרְתִּי עַל סַבְתָּא", "אֶתְמוֹל דִּבַּרְנוּ עִם סַבְתָּא"] },
      { english: "tomorrow we will talk about it", hebrew: "מָחָר נְדַבֵּר עַל זֶה", wrong: ["מָחָר דִּבַּרְנוּ עַל זֶה", "מָחָר נְדַבֵּר עִם זֶה", "מָחָר אֲדַבֵּר עַל זֶה"] },
      { english: "she talked about him all day", hebrew: "הִיא דִּבְּרָה עָלָיו כָּל הַיּוֹם", wrong: ["הִיא דִּבְּרָה אִתּוֹ כָּל הַיּוֹם", "הִיא דִּבְּרָה אוֹתוֹ כָּל הַיּוֹם", "הִיא דִּבְּרָה עָלֶיהָ כָּל הַיּוֹם"] },
      { english: "I talked with her on the phone", hebrew: "דִּבַּרְתִּי אִתָּהּ בַּטֶּלֶפוֹן", wrong: ["דִּבַּרְתִּי עָלֶיהָ בַּטֶּלֶפוֹן", "דִּבַּרְתִּי אוֹתָהּ בַּטֶּלֶפוֹן", "דִּבַּרְתִּי אִתָּהּ עַל הַטֶּלֶפוֹן"] },
      { english: "the teacher (m.) talks with the parents", hebrew: "הַמּוֹרֶה מְדַבֵּר עִם הַהוֹרִים", wrong: ["הַמּוֹרֶה מְדַבֵּר אֶת הַהוֹרִים", "הַמּוֹרֶה מְדַבֵּר עַל הַהוֹרִים", "הַמּוֹרֶה מְדַבְּרִים עִם הַהוֹרִים"] },
      { english: "now he is talking with the seller", hebrew: "עַכְשָׁו הוּא מְדַבֵּר עִם הַמּוֹכֵר", wrong: ["עַכְשָׁו הוּא דִּבֵּר עִם הַמּוֹכֵר", "עַכְשָׁו הוּא מְדַבֵּר עַל הַמּוֹכֵר", "עַכְשָׁו הוּא מְדַבֶּרֶת עִם הַמּוֹכֵר"] },
      { english: "don't talk in class! (to a boy)", hebrew: "אַל תְּדַבֵּר בַּשִּׁעוּר!", wrong: ["אַל תְּדַבֵּר לַשִּׁעוּר!", "אַל מְדַבֵּר בַּשִּׁעוּר!", "אַל תְּדַבְּרִי בַּשִּׁעוּר!"] },
      { english: "they (f.) speak Hebrew and English", hebrew: "הֵן מְדַבְּרוֹת עִבְרִית וְאַנְגְּלִית", wrong: ["הֵן מְדַבְּרִים עִבְרִית וְאַנְגְּלִית", "הֵן מְדַבְּרוֹת אֶת עִבְרִית וְאַנְגְּלִית", "הֵן מְדֻבָּרוֹת עִבְרִית וְאַנְגְּלִית"] },
      { english: "everyone is talking about the new movie", hebrew: "כֻּלָּם מְדַבְּרִים עַל הַסֶּרֶט הֶחָדָשׁ", wrong: ["כֻּלָּם מְדַבְּרִים עִם הַסֶּרֶט הֶחָדָשׁ", "כֻּלָּם מְדַבֵּר עַל הַסֶּרֶט הֶחָדָשׁ", "כֻּלָּם מְדַבְּרִים אֶת הַסֶּרֶט הֶחָדָשׁ"] },
      { english: "the thing that we talked about", hebrew: "הַדָּבָר שֶׁדִּבַּרְנוּ עָלָיו", wrong: ["הַדָּבָר שֶׁדִּבַּרְנוּ אִתּוֹ", "הַדִּבּוּר שֶׁדִּבַּרְנוּ עָלָיו", "הַדָּבָר שֶׁנְּדַבֵּר עָלָיו"] },
    ],
  },
  {
    id: "root-avd", kind: "root", pattern: "paal", icon: "🌱", english: "Root ע־ב־ד: work", hebrew: "שֹׁרֶשׁ ע־ב־ד: לַעֲבֹד",
    words: [
      { english: "to work", hebrew: "לַעֲבֹד", wrong: ["עוֹבֵד", "עֲבוֹדָה", "לַעֲשׂוֹת"] },
      { english: "he works", hebrew: "הוּא עוֹבֵד", wrong: ["הוּא עוֹבֶדֶת", "הוּא עוֹבְדִים", "הוּא עָבַד"] },
      { english: "she works", hebrew: "הִיא עוֹבֶדֶת", wrong: ["הִיא עוֹבֵד", "הִיא עוֹבְדוֹת", "הִיא עָבְדָה"] },
      { english: "they (m.) work", hebrew: "הֵם עוֹבְדִים", wrong: ["הֵם עוֹבְדוֹת", "הֵם עוֹבֵד", "הֵם עָבְדוּ"] },
      { english: "they (f.) work", hebrew: "הֵן עוֹבְדוֹת", wrong: ["הֵן עוֹבְדִים", "הֵן עוֹבֶדֶת", "הֵן עָבְדוּ"] },
      { english: "work, a job", hebrew: "עֲבוֹדָה", wrong: ["עוֹבֵד", "מַעְבָּדָה", "עֲבוֹדוֹת"] },
      { english: "a worker (m.)", hebrew: "עוֹבֵד", wrong: ["עוֹבֶדֶת", "עֲבוֹדָה", "עוֹבְדִים"] },
      { english: "a lab", hebrew: "מַעְבָּדָה", wrong: ["עֲבוֹדָה", "עוֹבֶדֶת", "מִשְׂרָד"] },
      // עוֹבֵד + בְּ (where) / עַל (on a task) / עִם (with someone) / כְּ (as a ...) / עַל + a person = fooling them (slang)
      { english: "he works at the bank", hebrew: "הוּא עוֹבֵד בַּבַּנְק", wrong: ["הוּא עוֹבֵד מֵהַבַּנְק", "הוּא עוֹבֵד עַל הַבַּנְק", "הוּא עוֹבֵד אֶת הַבַּנְק"] },
      { english: "she works on the project", hebrew: "הִיא עוֹבֶדֶת עַל הַפְּרוֹיֶקְט", wrong: ["הִיא עוֹבֶדֶת לַפְּרוֹיֶקְט", "הִיא עוֹבֶדֶת אֶת הַפְּרוֹיֶקְט", "הִיא עוֹבֶדֶת מֵהַפְּרוֹיֶקְט"] },
      { english: "they (m.) work with Dana", hebrew: "הֵם עוֹבְדִים עִם דָּנָה", wrong: ["הֵם עוֹבְדִים עַל דָּנָה", "הֵם עוֹבְדִים אֶת דָּנָה", "הֵם עוֹבְדִים בְּדָנָה"] },
      { english: "he works as a teacher", hebrew: "הוּא עוֹבֵד כְּמוֹרֶה", wrong: ["הוּא עוֹבֵד לְמוֹרֶה", "הוּא עוֹבֵד בְּמוֹרֶה", "הוּא עוֹבֵד אֶת מוֹרֶה"] },
      { english: "he's fooling us (slang)", hebrew: "הוּא עוֹבֵד עָלֵינוּ", wrong: ["הוּא עוֹבֵד אִתָּנוּ", "הוּא עוֹבֵד אוֹתָנוּ", "הוּא עוֹבֵד לָנוּ"] },
      // The describing word from the root (מְעֻבָּד = processed) vs. the action (עוֹבֵד = works)
      { english: "processed (m.)", hebrew: "מְעֻבָּד", wrong: ["מְעַבֵּד", "עוֹבֵד", "מְעֻבֶּדֶת"] },
      { english: "processed food", hebrew: "אֹכֶל מְעֻבָּד", wrong: ["אֹכֶל עוֹבֵד", "אֹכֶל מְעַבֵּד", "אֹכֶל מְעֻבֶּדֶת"] },
      // ----- More practice (2026-11-12) -----
      // More present tense: I, you, we
      { english: "I work", hebrew: "אֲנִי עוֹבֵד", wrong: ["אֲנִי עוֹבֶדֶת", "אֲנִי עוֹבְדִים", "אֲנִי עָבַדְתִּי"], f: { hebrew: "אֲנִי עוֹבֶדֶת", wrong: ["אֲנִי עוֹבֵד", "אֲנִי עוֹבְדוֹת", "אֲנִי עָבַדְתִּי"] } },
      { english: "you (m.) work", hebrew: "אַתָּה עוֹבֵד", wrong: ["אַתָּה עוֹבֶדֶת", "אַתָּה עָבַדְתָּ", "אַתָּה עֲבוֹדָה"] },
      { english: "you (f.) work", hebrew: "אַתְּ עוֹבֶדֶת", wrong: ["אַתְּ עוֹבֵד", "אַתְּ עָבַדְתְּ", "אַתְּ עוֹבְדוֹת"] },
      { english: "we work", hebrew: "אֲנַחְנוּ עוֹבְדִים", wrong: ["אֲנַחְנוּ עוֹבֵד", "אֲנַחְנוּ עָבַדְנוּ", "אֲנַחְנוּ נַעֲבֹד"], f: { hebrew: "אֲנַחְנוּ עוֹבְדוֹת", wrong: ["אֲנַחְנוּ עוֹבֶדֶת", "אֲנַחְנוּ עָבַדְנוּ", "אֲנַחְנוּ נַעֲבֹד"] } },
      // Past and future
      { english: "he worked", hebrew: "הוּא עָבַד", wrong: ["הוּא עוֹבֵד", "הוּא יַעֲבֹד", "הוּא עָבְדָה"] },
      { english: "she worked", hebrew: "הִיא עָבְדָה", wrong: ["הִיא עָבַד", "הִיא עוֹבֶדֶת", "הִיא תַּעֲבֹד"] },
      { english: "I worked", hebrew: "עָבַדְתִּי", wrong: ["אֶעֱבֹד", "עָבַדְנוּ", "עָבַדְתָּ"] },
      { english: "they worked", hebrew: "הֵם עָבְדוּ", wrong: ["הֵם עוֹבְדִים", "הֵם יַעַבְדוּ", "הֵם עָבַד"] },
      { english: "he will work", hebrew: "הוּא יַעֲבֹד", wrong: ["הוּא עָבַד", "הוּא תַּעֲבֹד", "הוּא יַעַבְדוּ"] },
      { english: "she will work", hebrew: "הִיא תַּעֲבֹד", wrong: ["הִיא יַעֲבֹד", "הִיא עָבְדָה", "הִיא תַּעַבְדִי"] },
      // More describing words: feminine and plural
      { english: "processed (f.)", hebrew: "מְעֻבֶּדֶת", wrong: ["מְעַבֶּדֶת", "מְעֻבָּד", "עוֹבֶדֶת"] },
      { english: "processed (m. pl.)", hebrew: "מְעֻבָּדִים", wrong: ["מְעַבְּדִים", "מְעֻבָּדוֹת", "עוֹבְדִים"] },
      { english: "processed (f. pl.)", hebrew: "מְעֻבָּדוֹת", wrong: ["מְעַבְּדוֹת", "מְעֻבָּדִים", "עוֹבְדוֹת"] },
      { english: "processed cheese", hebrew: "גְּבִינָה מְעֻבֶּדֶת", wrong: ["גְּבִינָה מְעַבֶּדֶת", "גְּבִינָה מְעֻבָּד", "גְּבִינָה עוֹבֶדֶת"] },
      { english: "these products are processed", hebrew: "הַמּוּצָרִים הָאֵלֶּה מְעֻבָּדִים", wrong: ["הַמּוּצָרִים הָאֵלֶּה מְעַבְּדִים", "הַמּוּצָרִים הָאֵלֶּה מְעֻבָּדוֹת", "הַמּוּצָרִים הָאֵלֶּה עוֹבְדִים"] },
      { english: "the photos are edited (processed)", hebrew: "הַתְּמוּנוֹת מְעֻבָּדוֹת", wrong: ["הַתְּמוּנוֹת מְעֻבָּדִים", "הַתְּמוּנוֹת מְעַבְּדוֹת", "הַתְּמוּנוֹת עוֹבְדוֹת"] },
      // עוֹבֵד also means "works" for a machine (it functions)
      { english: "it works!", hebrew: "זֶה עוֹבֵד!", wrong: ["זֶה עוֹבֶדֶת!", "זֶה עֲבוֹדָה!", "זֶה עָבַד!"] },
      { english: "the computer doesn't work", hebrew: "הַמַּחְשֵׁב לֹא עוֹבֵד", wrong: ["הַמַּחְשֵׁב לֹא עוֹבֶדֶת", "הַמַּחְשֵׁב לֹא עֲבוֹדָה", "הַמַּחְשֵׁב לֹא מְעֻבָּד"] },
      // More nouns from the root
      { english: "jobs", hebrew: "עֲבוֹדוֹת", wrong: ["עֲבוֹדָה", "עוֹבְדוֹת", "עוֹבְדִים"] },
      { english: "a worker (f.)", hebrew: "עוֹבֶדֶת", wrong: ["עוֹבֵד", "עֲבוֹדָה", "עוֹבְדוֹת"] },
      { english: "workers (m.)", hebrew: "עוֹבְדִים", wrong: ["עוֹבֵד", "עֲבוֹדוֹת", "עוֹבְדוֹת"] },
      { english: "slaves", hebrew: "עֲבָדִים", wrong: ["עוֹבְדִים", "עֲבוֹדוֹת", "עֶבֶד"] },
      { english: "we were slaves in Egypt", hebrew: "עֲבָדִים הָיִינוּ בְּמִצְרַיִם", wrong: ["עוֹבְדִים הָיִינוּ בְּמִצְרַיִם", "עֶבֶד הָיִינוּ בְּמִצְרַיִם", "עֲבָדִים הָיוּ בְּמִצְרַיִם"] },
      // Everyday sentences
      { english: "I work at the store", hebrew: "אֲנִי עוֹבֵד בַּחֲנוּת", wrong: ["אֲנִי עוֹבֵד לַחֲנוּת", "אֲנִי עוֹבֵד עַל הַחֲנוּת", "אֲנִי עוֹבֵד מֵהַחֲנוּת"], f: { hebrew: "אֲנִי עוֹבֶדֶת בַּחֲנוּת", wrong: ["אֲנִי עוֹבֶדֶת לַחֲנוּת", "אֲנִי עוֹבֶדֶת עַל הַחֲנוּת", "אֲנִי עוֹבֶדֶת מֵהַחֲנוּת"] } },
      { english: "we work together on the project", hebrew: "אֲנַחְנוּ עוֹבְדִים בְּיַחַד עַל הַפְּרוֹיֶקְט", wrong: ["אֲנַחְנוּ עוֹבְדִים בְּיַחַד אֶת הַפְּרוֹיֶקְט", "אֲנַחְנוּ עוֹבְדִים בְּיַחַד לַפְּרוֹיֶקְט", "אֲנַחְנוּ עוֹבֵד בְּיַחַד עַל הַפְּרוֹיֶקְט"], f: { hebrew: "אֲנַחְנוּ עוֹבְדוֹת בְּיַחַד עַל הַפְּרוֹיֶקְט", wrong: ["אֲנַחְנוּ עוֹבְדוֹת בְּיַחַד אֶת הַפְּרוֹיֶקְט", "אֲנַחְנוּ עוֹבְדוֹת בְּיַחַד לַפְּרוֹיֶקְט", "אֲנַחְנוּ עוֹבֶדֶת בְּיַחַד עַל הַפְּרוֹיֶקְט"] } },
      { english: "I'm looking for a job", hebrew: "אֲנִי מְחַפֵּשׂ עֲבוֹדָה", wrong: ["אֲנִי מְחַפֵּשׂ עוֹבֵד", "אֲנִי מְחַפֵּשׂ אֶת עֲבוֹדָה", "אֲנִי מְחַפֵּשׂ מַעְבָּדָה"], f: { hebrew: "אֲנִי מְחַפֶּשֶׂת עֲבוֹדָה", wrong: ["אֲנִי מְחַפֶּשֶׂת עוֹבֵד", "אֲנִי מְחַפֶּשֶׂת אֶת עֲבוֹדָה", "אֲנִי מְחַפֶּשֶׂת מַעְבָּדָה"] } },
      { english: "I go to work by bus", hebrew: "אֲנִי נוֹסֵעַ לָעֲבוֹדָה בְּאוֹטוֹבּוּס", wrong: ["אֲנִי נוֹסֵעַ בָּעֲבוֹדָה בְּאוֹטוֹבּוּס", "אֲנִי נוֹסֵעַ לָעוֹבֵד בְּאוֹטוֹבּוּס", "אֲנִי נוֹסֵעַ לָעֲבוֹדָה לְאוֹטוֹבּוּס"], f: { hebrew: "אֲנִי נוֹסַעַת לָעֲבוֹדָה בְּאוֹטוֹבּוּס", wrong: ["אֲנִי נוֹסַעַת בָּעֲבוֹדָה בְּאוֹטוֹבּוּס", "אֲנִי נוֹסַעַת לָעוֹבֵד בְּאוֹטוֹבּוּס", "אֲנִי נוֹסַעַת לָעֲבוֹדָה לְאוֹטוֹבּוּס"] } },
      { english: "where do you (m.) work?", hebrew: "אֵיפֹה אַתָּה עוֹבֵד?", wrong: ["אֵיפֹה אַתָּה עוֹבֶדֶת?", "אֵיפֹה אַתָּה עֲבוֹדָה?", "לְאָן אַתָּה עוֹבֵד?"] },
      { english: "Dad works a lot", hebrew: "אַבָּא עוֹבֵד הַרְבֵּה", wrong: ["אַבָּא עוֹבֶדֶת הַרְבֵּה", "אַבָּא עֲבוֹדָה הַרְבֵּה", "אַבָּא מְעֻבָּד הַרְבֵּה"] },
      { english: "Mom works in a lab", hebrew: "אִמָּא עוֹבֶדֶת בְּמַעְבָּדָה", wrong: ["אִמָּא עוֹבֶדֶת לְמַעְבָּדָה", "אִמָּא עוֹבֵד בְּמַעְבָּדָה", "אִמָּא עוֹבֶדֶת בַּעֲבוֹדָה"] },
      { english: "yesterday I worked until night", hebrew: "אֶתְמוֹל עָבַדְתִּי עַד הַלַּיְלָה", wrong: ["אֶתְמוֹל אֶעֱבֹד עַד הַלַּיְלָה", "אֶתְמוֹל עָבַד עַד הַלַּיְלָה", "אֶתְמוֹל עָבַדְתִּי מֵהַלַּיְלָה"] },
      { english: "tomorrow he will work from home", hebrew: "מָחָר הוּא יַעֲבֹד מֵהַבַּיִת", wrong: ["מָחָר הוּא עָבַד מֵהַבַּיִת", "מָחָר הוּא יַעֲבֹד לַבַּיִת", "מָחָר הוּא יַעֲבֹד אֶת הַבַּיִת"] },
      { english: "she has a new job", hebrew: "יֵשׁ לָהּ עֲבוֹדָה חֲדָשָׁה", wrong: ["יֵשׁ לָהּ עֲבוֹדָה חָדָשׁ", "יֵשׁ לָהּ עוֹבֵד חָדָשׁ", "יֵשׁ לָהּ אֶת עֲבוֹדָה חֲדָשָׁה"] },
      { english: "she works with children", hebrew: "הִיא עוֹבֶדֶת עִם יְלָדִים", wrong: ["הִיא עוֹבֶדֶת עַל יְלָדִים", "הִיא עוֹבֶדֶת אֶת יְלָדִים", "הִיא עוֹבֶדֶת בִּילָדִים"] },
      { english: "I finished the work", hebrew: "סִיַּמְתִּי אֶת הָעֲבוֹדָה", wrong: ["סִיַּמְתִּי הָעֲבוֹדָה", "סִיַּמְתִּי אֶת הָעוֹבֵד", "סִיַּמְתִּי לָעֲבוֹדָה"] },
      { english: "he works at a restaurant in the summer", hebrew: "הוּא עוֹבֵד בְּמִסְעָדָה בַּקַּיִץ", wrong: ["הוּא עוֹבֵד לְמִסְעָדָה בַּקַּיִץ", "הוּא עוֹבֵד אֶת מִסְעָדָה בַּקַּיִץ", "הוּא עוֹבֵד בְּמִסְעָדָה לַקַּיִץ"] },
      { english: "she works as a doctor", hebrew: "הִיא עוֹבֶדֶת כְּרוֹפְאָה", wrong: ["הִיא עוֹבֶדֶת לְרוֹפְאָה", "הִיא עוֹבֶדֶת כְּרוֹפֵא", "הִיא עוֹבֶדֶת בְּרוֹפְאָה"] },
      { english: "a friend (m.) who works with me", hebrew: "חָבֵר שֶׁעוֹבֵד אִתִּי", wrong: ["חָבֵר שֶׁעוֹבֵד עָלַי", "חָבֵר שֶׁעוֹבֶדֶת אִתִּי", "חָבֵר שֶׁעוֹבֵד אוֹתִי"] },
    ],
  },
  {
    // ס־פ־ר has two verbs in two patterns: לְסַפֵּר (tell, פִּעֵל) here, לִסְפֹּר (count, פָּעַל) in "root-spr-count".
    // מְסַפֵּר + לְ (to whom) / עַל (about) / אֶת (what).
    id: "root-spr", kind: "root", pattern: "piel", icon: "🌱", english: "Root ס־פ־ר: tell", hebrew: "שֹׁרֶשׁ ס־פ־ר: לְסַפֵּר",
    words: [
      { english: "to tell", hebrew: "לְסַפֵּר", wrong: ["לִסְפֹּר", "מְסַפֵּר", "סִפּוּר"] },
      { english: "he tells", hebrew: "הוּא מְסַפֵּר", wrong: ["הוּא סוֹפֵר", "הוּא מְסַפֶּרֶת", "הוּא סִפֵּר"] },
      { english: "she tells", hebrew: "הִיא מְסַפֶּרֶת", wrong: ["הִיא סוֹפֶרֶת", "הִיא מְסַפֵּר", "הִיא סִפְּרָה"] },
      { english: "they (m.) tell", hebrew: "הֵם מְסַפְּרִים", wrong: ["הֵם סוֹפְרִים", "הֵם מְסַפְּרוֹת", "הֵם מְסַפֵּר"] },
      { english: "a story", hebrew: "סִפּוּר", wrong: ["סֵפֶר", "מִסְפָּר", "סִפְרִיָּה"] },
      { english: "she tells Dana a story", hebrew: "הִיא מְסַפֶּרֶת לְדָנָה סִפּוּר", wrong: ["הִיא מְסַפֶּרֶת אֶת דָּנָה סִפּוּר", "הִיא מְסַפֶּרֶת עַל דָּנָה סִפּוּר", "הִיא מְסַפֶּרֶת עִם דָּנָה סִפּוּר"] },
      { english: "he tells about the trip", hebrew: "הוּא מְסַפֵּר עַל הַטִּיּוּל", wrong: ["הוּא מְסַפֵּר לַטִּיּוּל", "הוּא מְסַפֵּר אֶת הַטִּיּוּל", "הוּא סוֹפֵר עַל הַטִּיּוּל"] },
      { english: "they (m.) tell the story", hebrew: "הֵם מְסַפְּרִים אֶת הַסִּפּוּר", wrong: ["הֵם מְסַפְּרִים הַסִּפּוּר", "הֵם מְסַפְּרִים לַסִּפּוּר", "הֵם סוֹפְרִים אֶת הַסִּפּוּר"] },
      { english: "I tell", hebrew: "אֲנִי מְסַפֵּר", wrong: ["אֲנִי מְסַפֶּרֶת", "אֲנִי סוֹפֵר", "אֲנִי סִפַּרְתִּי"], f: { hebrew: "אֲנִי מְסַפֶּרֶת", wrong: ["אֲנִי מְסַפֵּר", "אֲנִי סוֹפֶרֶת", "אֲנִי סִפַּרְתִּי"] } },
      { english: "you (m.) tell", hebrew: "אַתָּה מְסַפֵּר", wrong: ["אַתָּה מְסַפֶּרֶת", "אַתָּה סוֹפֵר", "אַתָּה מְסַפְּרִים"] },
      { english: "you (f.) tell", hebrew: "אַתְּ מְסַפֶּרֶת", wrong: ["אַתְּ מְסַפֵּר", "אַתְּ סוֹפֶרֶת", "אַתְּ מְסַפְּרוֹת"] },
      { english: "we tell", hebrew: "אֲנַחְנוּ מְסַפְּרִים", wrong: ["אֲנַחְנוּ סוֹפְרִים", "אֲנַחְנוּ מְסַפֵּר", "אֲנַחְנוּ סִפַּרְנוּ"], f: { hebrew: "אֲנַחְנוּ מְסַפְּרוֹת", wrong: ["אֲנַחְנוּ סוֹפְרוֹת", "אֲנַחְנוּ מְסַפֶּרֶת", "אֲנַחְנוּ סִפַּרְנוּ"] } },
      { english: "they (f.) tell", hebrew: "הֵן מְסַפְּרוֹת", wrong: ["הֵן מְסַפְּרִים", "הֵן סוֹפְרוֹת", "הֵן מְסַפֶּרֶת"] },
      { english: "I told", hebrew: "סִפַּרְתִּי", wrong: ["סָפַרְתִּי", "סִפַּרְנוּ", "אֲסַפֵּר"] },
      { english: "I'll tell you (m.) tomorrow", hebrew: "אֲנִי אֲסַפֵּר לְךָ מָחָר", wrong: ["אֲנִי אֲסַפֵּר אוֹתְךָ מָחָר", "אֲנִי סִפַּרְתִּי לְךָ מָחָר", "אֲנִי אֶסְפֹּר לְךָ מָחָר"] },
      { english: "yesterday she told me a secret", hebrew: "אֶתְמוֹל הִיא סִפְּרָה לִי סוֹד", wrong: ["אֶתְמוֹל הִיא סִפְּרָה אוֹתִי סוֹד", "אֶתְמוֹל הִיא סָפְרָה לִי סוֹד", "אֶתְמוֹל הִיא תְּסַפֵּר לִי סוֹד"] },
      { english: "don't tell anyone! (to a boy)", hebrew: "אַל תְּסַפֵּר לְאַף אֶחָד!", wrong: ["אַל תְּסַפֵּר אַף אֶחָד!", "אַל תִּסְפֹּר לְאַף אֶחָד!", "לֹא סַפֵּר לְאַף אֶחָד!"] },
      { english: "tell me about the movie! (to a girl)", hebrew: "סַפְּרִי לִי עַל הַסֶּרֶט!", wrong: ["סַפְּרִי לִי לַסֶּרֶט!", "סַפֵּר לִי עַל הַסֶּרֶט!", "סַפְּרִי אוֹתִי עַל הַסֶּרֶט!"] },
      { english: "stories", hebrew: "סִפּוּרִים", wrong: ["סִפּוּר", "סְפָרִים", "סִפְרִיּוֹת"] },
      { english: "my grandfather tells stories", hebrew: "סַבָּא שֶׁלִּי מְסַפֵּר סִפּוּרִים", wrong: ["סַבָּא שֶׁלִּי סוֹפֵר סִפּוּרִים", "סַבָּא שֶׁלִּי מְסַפֵּר סְפָרִים", "סַבָּא שֶׁלִּי מְסַפֶּרֶת סִפּוּרִים"] },
      { english: "they (f.) tell us about the trip", hebrew: "הֵן מְסַפְּרוֹת לָנוּ עַל הַטִּיּוּל", wrong: ["הֵן מְסַפְּרוֹת אוֹתָנוּ עַל הַטִּיּוּל", "הֵן מְסַפְּרוֹת לָנוּ לַטִּיּוּל", "הֵן מְסַפְּרִים לָנוּ עַל הַטִּיּוּל"] },
      { english: "you (m.) tell good jokes", hebrew: "אַתָּה מְסַפֵּר בְּדִיחוֹת טוֹבוֹת", wrong: ["אַתָּה סוֹפֵר בְּדִיחוֹת טוֹבוֹת", "אַתָּה מְסַפֵּר בְּדִיחוֹת טוֹבִים", "אַתָּה מְסַפֶּרֶת בְּדִיחוֹת טוֹבוֹת"] },
      { english: "the story is funny", hebrew: "הַסִּפּוּר מַצְחִיק", wrong: ["הַסִּפּוּר מַצְחִיקָה", "הַסֵּפֶר מַצְחִיק", "הַסִּפּוּרִים מַצְחִיק"] },
    ],
  },
  {
    // לִסְפֹּר (count) is the פָּעַל pattern of ס־פ־ר, plus the nouns from the root (book, library, number…).
    // סוֹפֵר (counts) + אֶת.
    id: "root-spr-count", kind: "root", pattern: "paal", icon: "🌱", english: "Root ס־פ־ר: count, book", hebrew: "שֹׁרֶשׁ ס־פ־ר: לִסְפֹּר",
    words: [
      { english: "to count", hebrew: "לִסְפֹּר", wrong: ["לְסַפֵּר", "סוֹפֵר", "מִסְפָּר"] },
      { english: "he counts", hebrew: "הוּא סוֹפֵר", wrong: ["הוּא מְסַפֵּר", "הוּא סוֹפֶרֶת", "הוּא סָפַר"] },
      { english: "a book", hebrew: "סֵפֶר", wrong: ["סִפּוּר", "סִפְרִיָּה", "סְפָרִים"] },
      { english: "a library", hebrew: "סִפְרִיָּה", wrong: ["סֵפֶר", "סִפּוּר", "סַפָּר"] },
      { english: "a number", hebrew: "מִסְפָּר", wrong: ["סִפּוּר", "סֵפֶר", "מְסַפֵּר"] },
      { english: "a barber", hebrew: "סַפָּר", wrong: ["סֵפֶר", "סוֹפֵר", "סִפְרִיָּה"] },
      { english: "he counts the students", hebrew: "הוּא סוֹפֵר אֶת הַתַּלְמִידִים", wrong: ["הוּא מְסַפֵּר אֶת הַתַּלְמִידִים", "הוּא סוֹפֵר הַתַּלְמִידִים", "הוּא סוֹפֵר לַתַּלְמִידִים"] },
      { english: "the books are in the library", hebrew: "הַסְּפָרִים בַּסִּפְרִיָּה", wrong: ["הַסְּפָרִים לַסִּפְרִיָּה", "הַסְּפָרִים מֵהַסִּפְרִיָּה", "הַסֵּפֶר בַּסִּפְרִיָּה"] },
      { english: "the money is counted", hebrew: "הַכֶּסֶף סָפוּר", wrong: ["הַכֶּסֶף סוֹפֵר", "הַכֶּסֶף סְפוּרָה", "הַכֶּסֶף סִפֵּר"] },
      { english: "only a few days (counted days)", hebrew: "רַק יָמִים סְפוּרִים", wrong: ["רַק יָמִים סוֹפְרִים", "רַק יָמִים סִפּוּרִים", "רַק יָמִים סְפוּרוֹת"] },
      { english: "I count", hebrew: "אֲנִי סוֹפֵר", wrong: ["אֲנִי סוֹפֶרֶת", "אֲנִי מְסַפֵּר", "אֲנִי סָפַרְתִּי"], f: { hebrew: "אֲנִי סוֹפֶרֶת", wrong: ["אֲנִי סוֹפֵר", "אֲנִי מְסַפֶּרֶת", "אֲנִי סָפַרְתִּי"] } },
      { english: "she counts", hebrew: "הִיא סוֹפֶרֶת", wrong: ["הִיא מְסַפֶּרֶת", "הִיא סוֹפֵר", "הִיא סָפְרָה"] },
      { english: "they (m.) count", hebrew: "הֵם סוֹפְרִים", wrong: ["הֵם מְסַפְּרִים", "הֵם סוֹפְרוֹת", "הֵם סָפְרוּ"] },
      { english: "he counted", hebrew: "הוּא סָפַר", wrong: ["הוּא סִפֵּר", "הוּא סוֹפֵר", "הוּא יִסְפֹּר"] },
      { english: "I'll count the money tomorrow", hebrew: "אֲנִי אֶסְפֹּר אֶת הַכֶּסֶף מָחָר", wrong: ["אֲנִי אֲסַפֵּר אֶת הַכֶּסֶף מָחָר", "אֲנִי סָפַרְתִּי אֶת הַכֶּסֶף מָחָר", "אֲנִי אֶסְפֹּר הַכֶּסֶף מָחָר"] },
      // The describing word סָפוּר (counted): feminine and plural
      { english: "counted (f.)", hebrew: "סְפוּרָה", wrong: ["סוֹפֶרֶת", "סָפוּר", "סְפוּרוֹת"] },
      { english: "counted (m. pl.)", hebrew: "סְפוּרִים", wrong: ["סוֹפְרִים", "סְפוּרוֹת", "סִפּוּרִים"] },
      { english: "counted (f. pl.)", hebrew: "סְפוּרוֹת", wrong: ["סוֹפְרוֹת", "סְפוּרִים", "סְפוּרָה"] },
      { english: "only a few minutes", hebrew: "רַק דַּקּוֹת סְפוּרוֹת", wrong: ["רַק דַּקּוֹת סְפוּרִים", "רַק דַּקּוֹת סוֹפְרוֹת", "רַק דַּקָּה סְפוּרוֹת"] },
      { english: "only a few people came", hebrew: "רַק אֲנָשִׁים סְפוּרִים בָּאוּ", wrong: ["רַק אֲנָשִׁים סְפוּרוֹת בָּאוּ", "רַק אֲנָשִׁים סוֹפְרִים בָּאוּ", "רַק אֲנָשִׁים סְפוּרִים בָּא"] },
      { english: "books", hebrew: "סְפָרִים", wrong: ["סֵפֶר", "סִפּוּרִים", "סַפָּרִים"] },
      { english: "numbers", hebrew: "מִסְפָּרִים", wrong: ["מִסְפָּר", "סְפָרִים", "מְסַפְּרִים"] },
      { english: "a writer, an author (f.)", hebrew: "סוֹפֶרֶת", wrong: ["סוֹפֵר", "סַפָּרִית", "סִפְרוּת"] },
      { english: "literature", hebrew: "סִפְרוּת", wrong: ["סִפְרִיָּה", "סִפּוּר", "סְפָרִים"] },
      { english: "a haircut", hebrew: "תִּסְפֹּרֶת", wrong: ["סַפָּר", "סִפְרוּת", "סִפּוּר"] },
      { english: "a school", hebrew: "בֵּית סֵפֶר", wrong: ["בֵּית סְפָרִים", "בַּיִת סֵפֶר", "סֵפֶר בַּיִת"] },
      { english: "a bookstore", hebrew: "חֲנוּת סְפָרִים", wrong: ["חֲנוּת סֵפֶר", "סְפָרִים חֲנוּת", "חֲנוּת סִפּוּרִים"] },
      { english: "a phone number", hebrew: "מִסְפַּר טֶלֶפוֹן", wrong: ["סִפּוּר טֶלֶפוֹן", "טֶלֶפוֹן מִסְפָּר", "מִסְפָּרִים טֶלֶפוֹן"] },
      { english: "I'm reading an interesting book", hebrew: "אֲנִי קוֹרֵא סֵפֶר מְעַנְיֵן", wrong: ["אֲנִי קוֹרֵא סִפּוּר מְעַנְיֵן", "אֲנִי קוֹרֵא סֵפֶר מְעַנְיֶנֶת", "אֲנִי קוֹרֵאת סֵפֶר מְעַנְיֵן"], f: { hebrew: "אֲנִי קוֹרֵאת סֵפֶר מְעַנְיֵן", wrong: ["אֲנִי קוֹרֵאת סִפּוּר מְעַנְיֵן", "אֲנִי קוֹרֵאת סֵפֶר מְעַנְיֶנֶת", "אֲנִי קוֹרֵא סֵפֶר מְעַנְיֵן"] } },
      { english: "I borrow a book from the library", hebrew: "אֲנִי שׁוֹאֵל סֵפֶר מֵהַסִּפְרִיָּה", wrong: ["אֲנִי שׁוֹאֵל סֵפֶר לַסִּפְרִיָּה", "אֲנִי שׁוֹאֵל סִפּוּר מֵהַסִּפְרִיָּה", "אֲנִי שׁוֹאֶלֶת סֵפֶר מֵהַסִּפְרִיָּה"], f: { hebrew: "אֲנִי שׁוֹאֶלֶת סֵפֶר מֵהַסִּפְרִיָּה", wrong: ["אֲנִי שׁוֹאֶלֶת סֵפֶר לַסִּפְרִיָּה", "אֲנִי שׁוֹאֶלֶת סִפּוּר מֵהַסִּפְרִיָּה", "אֲנִי שׁוֹאֵל סֵפֶר מֵהַסִּפְרִיָּה"] } },
      { english: "the teacher (f.) counts the books", hebrew: "הַמּוֹרָה סוֹפֶרֶת אֶת הַסְּפָרִים", wrong: ["הַמּוֹרָה מְסַפֶּרֶת אֶת הַסְּפָרִים", "הַמּוֹרָה סוֹפֶרֶת הַסְּפָרִים", "הַמּוֹרָה סוֹפֵר אֶת הַסְּפָרִים"] },
      { english: "we count to ten", hebrew: "אֲנַחְנוּ סוֹפְרִים עַד עֶשֶׂר", wrong: ["אֲנַחְנוּ מְסַפְּרִים עַד עֶשֶׂר", "אֲנַחְנוּ סוֹפְרִים לְעֶשֶׂר", "אֲנַחְנוּ סוֹפֵר עַד עֶשֶׂר"], f: { hebrew: "אֲנַחְנוּ סוֹפְרוֹת עַד עֶשֶׂר", wrong: ["אֲנַחְנוּ מְסַפְּרוֹת עַד עֶשֶׂר", "אֲנַחְנוּ סוֹפְרוֹת לְעֶשֶׂר", "אֲנַחְנוּ סוֹפֶרֶת עַד עֶשֶׂר"] } },
      { english: "what's your phone number? (to a boy)", hebrew: "מָה מִסְפַּר הַטֶּלֶפוֹן שֶׁלְּךָ?", wrong: ["מָה מִסְפַּר הַטֶּלֶפוֹן שֶׁלָּךְ?", "מָה סִפּוּר הַטֶּלֶפוֹן שֶׁלְּךָ?", "מָה מְסַפֵּר הַטֶּלֶפוֹן שֶׁלְּךָ?"] },
      { english: "he goes to the barber", hebrew: "הוּא הוֹלֵךְ לַסַּפָּר", wrong: ["הוּא הוֹלֵךְ לַסֵּפֶר", "הוּא הוֹלֵךְ בַּסַּפָּר", "הוּא הוֹלֵךְ אֶת הַסַּפָּר"] },
      { english: "a new haircut", hebrew: "תִּסְפֹּרֶת חֲדָשָׁה", wrong: ["תִּסְפֹּרֶת חָדָשׁ", "סַפָּר חֲדָשָׁה", "תִּסְפֹּרֶת חֲדָשִׁים"] },
      { english: "the writer (f.) wrote a new book", hebrew: "הַסּוֹפֶרֶת כָּתְבָה סֵפֶר חָדָשׁ", wrong: ["הַסּוֹפֶרֶת כָּתַב סֵפֶר חָדָשׁ", "הַסַּפָּרִית כָּתְבָה סֵפֶר חָדָשׁ", "הַסּוֹפֶרֶת כָּתְבָה סֵפֶר חֲדָשָׁה"] },
    ],
  },
  {
    id: "root-akl-sht", kind: "root", pattern: "paal", icon: "🌱", english: "Roots א־כ־ל + ש־ת־ה: eat & drink", hebrew: "שָׁרָשִׁים א־כ־ל + ש־ת־ה: לֶאֱכֹל, לִשְׁתּוֹת",
    words: [
      { english: "to eat", hebrew: "לֶאֱכֹל", wrong: ["לִשְׁתּוֹת", "אוֹכֵל", "אֹכֶל"] },
      { english: "to drink", hebrew: "לִשְׁתּוֹת", wrong: ["לֶאֱכֹל", "שׁוֹתֶה", "שְׁתִיָּה"] },
      { english: "he eats", hebrew: "הוּא אוֹכֵל", wrong: ["הוּא אוֹכֶלֶת", "הוּא אוֹכְלִים", "הוּא אָכַל"] },
      { english: "she eats", hebrew: "הִיא אוֹכֶלֶת", wrong: ["הִיא אוֹכֵל", "הִיא אוֹכְלוֹת", "הִיא אָכְלָה"] },
      { english: "they (m.) eat", hebrew: "הֵם אוֹכְלִים", wrong: ["הֵם אוֹכְלוֹת", "הֵם אוֹכֵל", "הֵם אָכְלוּ"] },
      { english: "she drinks", hebrew: "הִיא שׁוֹתָה", wrong: ["הִיא שׁוֹתֶה", "הִיא שׁוֹתוֹת", "הִיא שָׁתְתָה"] },
      { english: "they (m.) drink", hebrew: "הֵם שׁוֹתִים", wrong: ["הֵם שׁוֹתוֹת", "הֵם שׁוֹתֶה", "הֵם שָׁתוּ"] },
      { english: "food", hebrew: "אֹכֶל", wrong: ["אוֹכֵל", "מַאֲכָל", "שְׁתִיָּה"] },
      { english: "a dish (a kind of food)", hebrew: "מַאֲכָל", wrong: ["אֹכֶל", "מַאֲכָלִים", "מִשְׁתֶּה"] },
      { english: "dining room", hebrew: "חֲדַר אֹכֶל", wrong: ["חֲדַר שֵׁנָה", "חֲדַר אוֹכֵל", "אֹכֶל חֶדֶר"] },
      { english: "a drink", hebrew: "שְׁתִיָּה", wrong: ["שׁוֹתֶה", "מִשְׁתֶּה", "אֹכֶל"] },
      { english: "a feast", hebrew: "מִשְׁתֶּה", wrong: ["שְׁתִיָּה", "מַאֲכָל", "שׁוֹתִים"] },
      // אוֹכֵל + אֶת (what) / בְּ (where) / עִם (with whom) / מִ (from). שׁוֹתֶה + מִ (from) / לְ (to = a toast)
      { english: "she eats the apple", hebrew: "הִיא אוֹכֶלֶת אֶת הַתַּפּוּחַ", wrong: ["הִיא אוֹכֶלֶת הַתַּפּוּחַ", "הִיא אוֹכֶלֶת לַתַּפּוּחַ", "הִיא אוֹכֶלֶת מֵהַתַּפּוּחַ"] },
      { english: "he eats at a restaurant", hebrew: "הוּא אוֹכֵל בְּמִסְעָדָה", wrong: ["הוּא אוֹכֵל לְמִסְעָדָה", "הוּא אוֹכֵל מִמִּסְעָדָה", "הוּא אוֹכֵל אֶת מִסְעָדָה"] },
      { english: "they (m.) eat with their friends", hebrew: "הֵם אוֹכְלִים עִם הַחֲבֵרִים", wrong: ["הֵם אוֹכְלִים אֶת הַחֲבֵרִים", "הֵם אוֹכְלִים לַחֲבֵרִים", "הֵם אוֹכְלִים מֵהַחֲבֵרִים"] },
      { english: "he eats from the plate", hebrew: "הוּא אוֹכֵל מֵהַצַּלַּחַת", wrong: ["הוּא אוֹכֵל לַצַּלַּחַת", "הוּא אוֹכֵל אֶת הַצַּלַּחַת", "הוּא אוֹכֵל עַל הַצַּלַּחַת"] },
      { english: "she drinks from the bottle", hebrew: "הִיא שׁוֹתָה מֵהַבַּקְבּוּק", wrong: ["הִיא שׁוֹתָה לַבַּקְבּוּק", "הִיא שׁוֹתָה אֶת הַבַּקְבּוּק", "הִיא שׁוֹתָה עַל הַבַּקְבּוּק"] },
      { english: "they (m.) drink to life (cheers!)", hebrew: "הֵם שׁוֹתִים לְחַיִּים", wrong: ["הֵם שׁוֹתִים בְּחַיִּים", "הֵם שׁוֹתִים מֵחַיִּים", "הֵם שׁוֹתִים אֶת חַיִּים"] },
      // Describing words from the roots: אָכִיל = edible, שָׁתוּי = drunk, vs. the actions (אוֹכֵל, שׁוֹתֶה)
      { english: "edible (m.)", hebrew: "אָכִיל", wrong: ["אוֹכֵל", "אֹכֶל", "אֲכִילָה"] },
      { english: "this mushroom is not edible", hebrew: "הַפִּטְרִיָּה הַזֹּאת לֹא אֲכִילָה", wrong: ["הַפִּטְרִיָּה הַזֹּאת לֹא אָכִיל", "הַפִּטְרִיָּה הַזֹּאת לֹא אוֹכֶלֶת", "הַפִּטְרִיָּה הַזֶּה לֹא אֲכִילָה"] },
      { english: "drunk (m.)", hebrew: "שָׁתוּי", wrong: ["שׁוֹתֶה", "שְׁתוּיָה", "שָׁתָה"] },
      // ----- More practice (2026-11-12) -----
      // More present-tense forms
      { english: "I eat", hebrew: "אֲנִי אוֹכֵל", wrong: ["אֲנִי אוֹכֶלֶת", "אֲנִי אֹכֶל", "אֲנִי אָכַלְתִּי"], f: { hebrew: "אֲנִי אוֹכֶלֶת", wrong: ["אֲנִי אוֹכֵל", "אֲנִי אוֹכְלוֹת", "אֲנִי אָכַלְתִּי"] } },
      { english: "you (f.) eat", hebrew: "אַתְּ אוֹכֶלֶת", wrong: ["אַתְּ אוֹכֵל", "אַתְּ שׁוֹתָה", "אַתְּ אוֹכְלוֹת"] },
      { english: "they (f.) eat", hebrew: "הֵן אוֹכְלוֹת", wrong: ["הֵן אוֹכְלִים", "הֵן אוֹכֶלֶת", "הֵן אָכְלוּ"] },
      { english: "I drink", hebrew: "אֲנִי שׁוֹתֶה", wrong: ["אֲנִי שׁוֹתָה", "אֲנִי שָׁתִיתִי", "אֲנִי שְׁתִיָּה"], f: { hebrew: "אֲנִי שׁוֹתָה", wrong: ["אֲנִי שׁוֹתֶה", "אֲנִי שָׁתִיתִי", "אֲנִי שׁוֹתוֹת"] } },
      { english: "he drinks", hebrew: "הוּא שׁוֹתֶה", wrong: ["הוּא שׁוֹתָה", "הוּא שָׁתָה", "הוּא שׁוֹתִים"] },
      { english: "we drink", hebrew: "אֲנַחְנוּ שׁוֹתִים", wrong: ["אֲנַחְנוּ שׁוֹתֶה", "אֲנַחְנוּ שָׁתִינוּ", "אֲנַחְנוּ אוֹכְלִים"], f: { hebrew: "אֲנַחְנוּ שׁוֹתוֹת", wrong: ["אֲנַחְנוּ שׁוֹתָה", "אֲנַחְנוּ שָׁתִינוּ", "אֲנַחְנוּ אוֹכְלוֹת"] } },
      { english: "they (f.) drink", hebrew: "הֵן שׁוֹתוֹת", wrong: ["הֵן שׁוֹתִים", "הֵן שׁוֹתָה", "הֵן שָׁתוּ"] },
      // Past and future
      { english: "I ate", hebrew: "אָכַלְתִּי", wrong: ["אָכַלְנוּ", "אֶאֱכֹל", "אָכְלָה"] },
      { english: "she drank", hebrew: "הִיא שָׁתְתָה", wrong: ["הִיא שָׁתָה", "הִיא שׁוֹתָה", "הִיא תִּשְׁתֶּה"] },
      { english: "he will eat later", hebrew: "הוּא יֹאכַל אַחַר כָּךְ", wrong: ["הוּא אָכַל אַחַר כָּךְ", "הוּא תֹּאכַל אַחַר כָּךְ", "הוּא יִשְׁתֶּה אַחַר כָּךְ"] },
      { english: "what will you (m.) drink?", hebrew: "מָה תִּשְׁתֶּה?", wrong: ["מָה תִּשְׁתִּי?", "מָה שָׁתִיתָ?", "מָה תֹּאכַל?"] },
      // Describing words: אָכִיל (edible) and שָׁתוּי (drunk) in feminine and plural
      { english: "edible (f.)", hebrew: "אֲכִילָה", wrong: ["אָכִיל", "אוֹכֶלֶת", "אֲכִילוֹת"] },
      { english: "edible (m. pl.)", hebrew: "אֲכִילִים", wrong: ["אוֹכְלִים", "אֲכִילוֹת", "אָכִיל"] },
      { english: "edible (f. pl.)", hebrew: "אֲכִילוֹת", wrong: ["אוֹכְלוֹת", "אֲכִילִים", "אֲכִילָה"] },
      { english: "is this fish edible?", hebrew: "הַאִם הַדָּג הַזֶּה אָכִיל?", wrong: ["הַאִם הַדָּג הַזֶּה אֲכִילָה?", "הַאִם הַדָּג הַזֶּה אוֹכֵל?", "הַאִם הַדָּג הַזֹּאת אָכִיל?"] },
      { english: "these fruits are edible", hebrew: "הַפֵּרוֹת הָאֵלֶּה אֲכִילִים", wrong: ["הַפֵּרוֹת הָאֵלֶּה אֲכִילוֹת", "הַפֵּרוֹת הָאֵלֶּה אוֹכְלִים", "הַפֵּרוֹת הָאֵלֶּה אָכִיל"] },
      { english: "these mushrooms are edible", hebrew: "הַפִּטְרִיּוֹת הָאֵלֶּה אֲכִילוֹת", wrong: ["הַפִּטְרִיּוֹת הָאֵלֶּה אֲכִילִים", "הַפִּטְרִיּוֹת הָאֵלֶּה אוֹכְלוֹת", "הַפִּטְרִיּוֹת הָאֵלֶּה אֲכִילָה"] },
      { english: "drunk (f.)", hebrew: "שְׁתוּיָה", wrong: ["שׁוֹתָה", "שָׁתוּי", "שְׁתוּיוֹת"] },
      { english: "drunk (m. pl.)", hebrew: "שְׁתוּיִים", wrong: ["שׁוֹתִים", "שְׁתוּיוֹת", "שָׁתוּי"] },
      { english: "drunk (f. pl.)", hebrew: "שְׁתוּיוֹת", wrong: ["שׁוֹתוֹת", "שְׁתוּיִים", "שְׁתוּיָה"] },
      { english: "he isn't drunk, he's tired", hebrew: "הוּא לֹא שָׁתוּי, הוּא עָיֵף", wrong: ["הוּא לֹא שׁוֹתֶה, הוּא עָיֵף", "הוּא לֹא שְׁתוּיָה, הוּא עָיֵף", "הוּא לֹא שָׁתָה, הוּא עָיֵף"] },
      { english: "a drunk driver is dangerous", hebrew: "נֶהָג שָׁתוּי מְסֻכָּן", wrong: ["נֶהָג שׁוֹתֶה מְסֻכָּן", "נֶהָג שְׁתוּיָה מְסֻכָּן", "נֶהָג שָׁתוּי מְסֻכֶּנֶת"] },
      // More nouns from the roots
      { english: "dishes (kinds of food)", hebrew: "מַאֲכָלִים", wrong: ["מַאֲכָל", "אוֹכְלִים", "מַאֲכָלוֹת"] },
      { english: "eating (the act)", hebrew: "אֲכִילָה", wrong: ["אוֹכֵל", "אֹכֶל", "לֶאֱכֹל"] },
      { english: "a beverage", hebrew: "מַשְׁקֶה", wrong: ["מִשְׁתֶּה", "שׁוֹתֶה", "מַשְׁקָאוֹת"] },
      { english: "cold drinks (beverages)", hebrew: "מַשְׁקָאוֹת קָרִים", wrong: ["מַשְׁקָאוֹת קָרוֹת", "מַשְׁקֶה קָרִים", "מִשְׁתָּאוֹת קָרִים"] },
      { english: "drinking water", hebrew: "מֵי שְׁתִיָּה", wrong: ["מַיִם שְׁתִיָּה", "מֵי שׁוֹתֶה", "מֵי מִשְׁתֶּה"] },
      { english: "the food is tasty", hebrew: "הָאֹכֶל טָעִים", wrong: ["הָאוֹכֵל טָעִים", "הָאֹכֶל טְעִימָה", "אֹכֶל הַטָּעִים"] },
      { english: "hummus is my favorite dish", hebrew: "חוּמוּס הוּא הַמַּאֲכָל הָאָהוּב עָלַי", wrong: ["חוּמוּס הִיא הַמַּאֲכָל הָאָהוּב עָלַי", "חוּמוּס הוּא הַמַּאֲכָל הָאֲהוּבָה עָלַי", "חוּמוּס הוּא הַמַּאֲכָל הָאָהוּב אֵלַי"] },
      // Everyday sentences
      { english: "I eat breakfast at seven", hebrew: "אֲנִי אוֹכֵל אֲרוּחַת בֹּקֶר בְּשֶׁבַע", wrong: ["אֲנִי אוֹכֶלֶת אֲרוּחַת בֹּקֶר בְּשֶׁבַע", "אֲנִי אוֹכֵל אֲרוּחַת בֹּקֶר לְשֶׁבַע", "אֲנִי אוֹכֵל אֶת אֲרוּחַת בֹּקֶר בְּשֶׁבַע"], f: { hebrew: "אֲנִי אוֹכֶלֶת אֲרוּחַת בֹּקֶר בְּשֶׁבַע", wrong: ["אֲנִי אוֹכֵל אֲרוּחַת בֹּקֶר בְּשֶׁבַע", "אֲנִי אוֹכֶלֶת אֲרוּחַת בֹּקֶר לְשֶׁבַע", "אֲנִי אוֹכֶלֶת אֶת אֲרוּחַת בֹּקֶר בְּשֶׁבַע"] } },
      { english: "we eat lunch together", hebrew: "אֲנַחְנוּ אוֹכְלִים אֲרוּחַת צָהֳרַיִם בְּיַחַד", wrong: ["אֲנַחְנוּ אוֹכֵל אֲרוּחַת צָהֳרַיִם בְּיַחַד", "אֲנַחְנוּ שׁוֹתִים אֲרוּחַת צָהֳרַיִם בְּיַחַד", "אֲנַחְנוּ אוֹכְלִים אֶת אֲרוּחַת צָהֳרַיִם בְּיַחַד"], f: { hebrew: "אֲנַחְנוּ אוֹכְלוֹת אֲרוּחַת צָהֳרַיִם בְּיַחַד", wrong: ["אֲנַחְנוּ אוֹכֶלֶת אֲרוּחַת צָהֳרַיִם בְּיַחַד", "אֲנַחְנוּ שׁוֹתוֹת אֲרוּחַת צָהֳרַיִם בְּיַחַד", "אֲנַחְנוּ אוֹכְלוֹת אֶת אֲרוּחַת צָהֳרַיִם בְּיַחַד"] } },
      { english: "we don't eat meat", hebrew: "אֲנַחְנוּ לֹא אוֹכְלִים בָּשָׂר", wrong: ["אֲנַחְנוּ לֹא אוֹכֵל בָּשָׂר", "אֲנַחְנוּ לֹא אוֹכְלִים אֶת בָּשָׂר", "לֹא אֲנַחְנוּ אוֹכְלִים בָּשָׂר"], f: { hebrew: "אֲנַחְנוּ לֹא אוֹכְלוֹת בָּשָׂר", wrong: ["אֲנַחְנוּ לֹא אוֹכֶלֶת בָּשָׂר", "אֲנַחְנוּ לֹא אוֹכְלוֹת אֶת בָּשָׂר", "לֹא אֲנַחְנוּ אוֹכְלוֹת בָּשָׂר"] } },
      { english: "he drinks coffee every morning", hebrew: "הוּא שׁוֹתֶה קָפֶה כָּל בֹּקֶר", wrong: ["הוּא שׁוֹתָה קָפֶה כָּל בֹּקֶר", "הוּא שׁוֹתֶה אֶת קָפֶה כָּל בֹּקֶר", "הוּא שׁוֹתֶה מִקָּפֶה כָּל בֹּקֶר"] },
      { english: "you (f.) need to drink a lot of water", hebrew: "אַתְּ צְרִיכָה לִשְׁתּוֹת הַרְבֵּה מַיִם", wrong: ["אַתְּ צְרִיכָה שׁוֹתָה הַרְבֵּה מַיִם", "אַתְּ צָרִיךְ לִשְׁתּוֹת הַרְבֵּה מַיִם", "אַתְּ צְרִיכָה לִשְׁתּוֹת אֶת הַרְבֵּה מַיִם"] },
      { english: "what do you (m.) want to drink?", hebrew: "מָה אַתָּה רוֹצֶה לִשְׁתּוֹת?", wrong: ["מָה אַתָּה רוֹצֶה שׁוֹתֶה?", "מָה אַתָּה רוֹצָה לִשְׁתּוֹת?", "מָה אַתָּה רוֹצֶה לֶאֱכֹל?"] },
      { english: "yesterday we ate pizza at Dana's", hebrew: "אֶתְמוֹל אָכַלְנוּ פִּיצָה אֵצֶל דָּנָה", wrong: ["אֶתְמוֹל אָכַלְנוּ פִּיצָה לְדָנָה", "אֶתְמוֹל אָכַלְנוּ אֶת פִּיצָה אֵצֶל דָּנָה", "אֶתְמוֹל נֹאכַל פִּיצָה אֵצֶל דָּנָה"] },
      { english: "she drank all the juice", hebrew: "הִיא שָׁתְתָה אֶת כָּל הַמִּיץ", wrong: ["הִיא שָׁתְתָה כָּל הַמִּיץ", "הִיא שָׁתָה אֶת כָּל הַמִּיץ", "הִיא אָכְלָה אֶת כָּל הַמִּיץ"] },
      { english: "who ate my sandwich?", hebrew: "מִי אָכַל אֶת הַכָּרִיךְ שֶׁלִּי?", wrong: ["מִי אָכַל הַכָּרִיךְ שֶׁלִּי?", "מִי אָכַל לַכָּרִיךְ שֶׁלִּי?", "מִי יֹאכַל אֶת הַכָּרִיךְ שֶׁלִּי?"] },
      { english: "Dana made a cake and we ate it", hebrew: "דָּנָה הֵכִינָה עוּגָה וַאֲנַחְנוּ אָכַלְנוּ אוֹתָהּ", wrong: ["דָּנָה הֵכִינָה עוּגָה וַאֲנַחְנוּ אָכַלְנוּ אוֹתוֹ", "דָּנָה הֵכִינָה עוּגָה וַאֲנַחְנוּ אָכַלְנוּ הִיא", "דָּנָה הֵכִינָה עוּגָה וַאֲנַחְנוּ אָכַלְנוּ לָהּ"] },
      { english: "we bought drinks for the party", hebrew: "קָנִינוּ מַשְׁקָאוֹת לַמְּסִבָּה", wrong: ["קָנִינוּ מַשְׁקָאוֹת בַּמְּסִבָּה", "קָנִינוּ מִשְׁתָּאוֹת לַמְּסִבָּה", "קָנִינוּ אֶת מַשְׁקָאוֹת לַמְּסִבָּה"] },
      { english: "I'm hungry, let's eat!", hebrew: "אֲנִי רָעֵב, בּוֹאוּ נֹאכַל!", wrong: ["אֲנִי רְעֵבָה, בּוֹאוּ נֹאכַל!", "אֲנִי רָעֵב, בּוֹאוּ אוֹכְלִים!", "אֲנִי רָעֵב, בּוֹאוּ נִשְׁתֶּה!"], f: { hebrew: "אֲנִי רְעֵבָה, בּוֹאוּ נֹאכַל!", wrong: ["אֲנִי רָעֵב, בּוֹאוּ נֹאכַל!", "אֲנִי רְעֵבָה, בּוֹאוּ אוֹכְלוֹת!", "אֲנִי רְעֵבָה, בּוֹאוּ נִשְׁתֶּה!"] } },
    ],
  },
  {
    id: "root-hlk-bo", kind: "root", pattern: "paal", icon: "🌱", english: "Roots ה־ל־ך + ב־ו־א: go & come", hebrew: "שָׁרָשִׁים ה־ל־ך + ב־ו־א: לָלֶכֶת, לָבוֹא",
    words: [
      { english: "to go, to walk", hebrew: "לָלֶכֶת", wrong: ["לָבוֹא", "הוֹלֵךְ", "הֲלִיכָה"] },
      { english: "to come", hebrew: "לָבוֹא", wrong: ["לָלֶכֶת", "בָּא", "לָצֵאת"] },
      { english: "he goes", hebrew: "הוּא הוֹלֵךְ", wrong: ["הוּא הוֹלֶכֶת", "הוּא בָּא", "הוּא הָלַךְ"] },
      { english: "she goes", hebrew: "הִיא הוֹלֶכֶת", wrong: ["הִיא הוֹלֵךְ", "הִיא בָּאָה", "הִיא הָלְכָה"] },
      { english: "they (m.) go", hebrew: "הֵם הוֹלְכִים", wrong: ["הֵם הוֹלְכוֹת", "הֵם בָּאִים", "הֵם הוֹלֵךְ"] },
      { english: "he comes", hebrew: "הוּא בָּא", wrong: ["הוּא בָּאָה", "הוּא הוֹלֵךְ", "הוּא בָּאִים"] },
      { english: "she comes", hebrew: "הִיא בָּאָה", wrong: ["הִיא בָּא", "הִיא הוֹלֶכֶת", "הִיא בָּאוֹת"] },
      { english: "they (f.) come", hebrew: "הֵן בָּאוֹת", wrong: ["הֵן בָּאִים", "הֵן הוֹלְכוֹת", "הֵן בָּאָה"] },
      { english: "walking", hebrew: "הֲלִיכָה", wrong: ["הוֹלֵךְ", "לָלֶכֶת", "הֲלִיכוֹת"] },
      { english: "a pedestrian", hebrew: "הוֹלֵךְ רֶגֶל", wrong: ["הוֹלֵךְ לְרֶגֶל", "רֶגֶל הוֹלֵךְ", "הֲלִיכָה"] },
      { english: "next year", hebrew: "הַשָּׁנָה הַבָּאָה", wrong: ["הַשָּׁנָה הַבָּא", "הַשָּׁנָה שֶׁעָבְרָה", "שָׁנָה בָּאָה"] },
      { english: "welcome (to a man)", hebrew: "בָּרוּךְ הַבָּא", wrong: ["בָּרוּךְ הַהוֹלֵךְ", "בָּרוּךְ בָּא", "בְּרוּכִים הַבָּא"] },
      // הוֹלֵךְ + לְ (to a place) / בְּ (walks in a place) / עִם (with someone). בָּא + מִ (from) / לְ (to) / בְּ (by bus, car...)
      { english: "he goes to school", hebrew: "הוּא הוֹלֵךְ לְבֵית הַסֵּפֶר", wrong: ["הוּא הוֹלֵךְ בְּבֵית הַסֵּפֶר", "הוּא הוֹלֵךְ מִבֵּית הַסֵּפֶר", "הוּא הוֹלֵךְ אֶת בֵּית הַסֵּפֶר"] },
      { english: "she walks in the park", hebrew: "הִיא הוֹלֶכֶת בַּפַּארְק", wrong: ["הִיא הוֹלֶכֶת לַפַּארְק", "הִיא הוֹלֶכֶת מֵהַפַּארְק", "הִיא הוֹלֶכֶת אֶת הַפַּארְק"] },
      { english: "she goes to the park", hebrew: "הִיא הוֹלֶכֶת לַפַּארְק", wrong: ["הִיא הוֹלֶכֶת בַּפַּארְק", "הִיא בָּאָה לַפַּארְק", "הִיא הוֹלֶכֶת אֶת הַפַּארְק"] },
      { english: "they (m.) go with Dana", hebrew: "הֵם הוֹלְכִים עִם דָּנָה", wrong: ["הֵם הוֹלְכִים לְדָנָה", "הֵם הוֹלְכִים אֶת דָּנָה", "הֵם הוֹלְכִים בְּדָנָה"] },
      { english: "he comes from Jerusalem", hebrew: "הוּא בָּא מִירוּשָׁלַיִם", wrong: ["הוּא בָּא לִירוּשָׁלַיִם", "הוּא בָּא בִּירוּשָׁלַיִם", "הוּא הוֹלֵךְ מִירוּשָׁלַיִם"] },
      { english: "she comes to the party", hebrew: "הִיא בָּאָה לַמְּסִבָּה", wrong: ["הִיא בָּאָה מֵהַמְּסִבָּה", "הִיא בָּאָה בַּמְּסִבָּה", "הִיא בָּא לַמְּסִבָּה"] },
      { english: "they (f.) come by bus", hebrew: "הֵן בָּאוֹת בְּאוֹטוֹבּוּס", wrong: ["הֵן בָּאוֹת לְאוֹטוֹבּוּס", "הֵן בָּאוֹת מֵאוֹטוֹבּוּס", "הֵן בָּאִים בְּאוֹטוֹבּוּס"] },
      // ----- More practice (2026-11-12) -----
      // More present-tense forms
      { english: "I go", hebrew: "אֲנִי הוֹלֵךְ", wrong: ["אֲנִי הוֹלֶכֶת", "אֲנִי בָּא", "אֲנִי הָלַכְתִּי"], f: { hebrew: "אֲנִי הוֹלֶכֶת", wrong: ["אֲנִי הוֹלֵךְ", "אֲנִי בָּאָה", "אֲנִי הָלַכְתִּי"] } },
      { english: "I come", hebrew: "אֲנִי בָּא", wrong: ["אֲנִי בָּאָה", "אֲנִי הוֹלֵךְ", "אֲנִי בָּאתִי"], f: { hebrew: "אֲנִי בָּאָה", wrong: ["אֲנִי בָּא", "אֲנִי הוֹלֶכֶת", "אֲנִי בָּאתִי"] } },
      { english: "you (m.) go", hebrew: "אַתָּה הוֹלֵךְ", wrong: ["אַתָּה הוֹלֶכֶת", "אַתָּה בָּא", "אַתָּה הָלַכְתָּ"] },
      { english: "you (f.) come", hebrew: "אַתְּ בָּאָה", wrong: ["אַתְּ בָּא", "אַתְּ הוֹלֶכֶת", "אַתְּ בָּאת"] },
      { english: "we go", hebrew: "אֲנַחְנוּ הוֹלְכִים", wrong: ["אֲנַחְנוּ הוֹלֵךְ", "אֲנַחְנוּ בָּאִים", "אֲנַחְנוּ הָלַכְנוּ"], f: { hebrew: "אֲנַחְנוּ הוֹלְכוֹת", wrong: ["אֲנַחְנוּ הוֹלֶכֶת", "אֲנַחְנוּ בָּאוֹת", "אֲנַחְנוּ הָלַכְנוּ"] } },
      { english: "we come", hebrew: "אֲנַחְנוּ בָּאִים", wrong: ["אֲנַחְנוּ בָּא", "אֲנַחְנוּ הוֹלְכִים", "אֲנַחְנוּ בָּאנוּ"], f: { hebrew: "אֲנַחְנוּ בָּאוֹת", wrong: ["אֲנַחְנוּ בָּאָה", "אֲנַחְנוּ הוֹלְכוֹת", "אֲנַחְנוּ בָּאנוּ"] } },
      { english: "they (f.) go", hebrew: "הֵן הוֹלְכוֹת", wrong: ["הֵן הוֹלְכִים", "הֵן בָּאוֹת", "הֵן הוֹלֶכֶת"] },
      { english: "they (m.) come", hebrew: "הֵם בָּאִים", wrong: ["הֵם בָּאוֹת", "הֵם הוֹלְכִים", "הֵם בָּאוּ"] },
      // Past, future and commands
      { english: "I'll come tomorrow", hebrew: "אֲנִי אָבוֹא מָחָר", wrong: ["אֲנִי בָּאתִי מָחָר", "אֲנִי יָבוֹא מָחָר", "אֲנִי אֵלֵךְ מָחָר"] },
      { english: "next week we'll go to the beach", hebrew: "בַּשָּׁבוּעַ הַבָּא נֵלֵךְ לַיָּם", wrong: ["בַּשָּׁבוּעַ הַבָּאָה נֵלֵךְ לַיָּם", "בַּשָּׁבוּעַ הַבָּא הָלַכְנוּ לַיָּם", "בַּשָּׁבוּעַ הַבָּא נֵלֵךְ בַּיָּם"] },
      { english: "come here! (to a boy)", hebrew: "בּוֹא הֵנָּה!", wrong: ["בּוֹאִי הֵנָּה!", "לֵךְ הֵנָּה!", "בָּא הֵנָּה!"] },
      { english: "go home! (to a boy)", hebrew: "לֵךְ הַבַּיְתָה!", wrong: ["לְכִי הַבַּיְתָה!", "בּוֹא הַבַּיְתָה!", "הוֹלֵךְ הַבַּיְתָה!"] },
      // הַבָּא / הַבָּאָה / הַבָּאִים / הַבָּאוֹת = next, coming (it agrees with the noun!)
      { english: "next time", hebrew: "הַפַּעַם הַבָּאָה", wrong: ["הַפַּעַם הַבָּא", "הַפַּעַם שֶׁעָבְרָה", "הַפַּעַם הַבָּאוֹת"] },
      { english: "the next stop", hebrew: "הַתַּחֲנָה הַבָּאָה", wrong: ["הַתַּחֲנָה הַבָּא", "הַתַּחֲנָה הַבָּאוֹת", "הַתַּחֲנָה הַהוֹלֶכֶת"] },
      { english: "the next questions", hebrew: "הַשְּׁאֵלוֹת הַבָּאוֹת", wrong: ["הַשְּׁאֵלוֹת הַבָּאִים", "הַשְּׁאֵלָה הַבָּאוֹת", "הַשְּׁאֵלוֹת הַבָּאָה"] },
      { english: "welcome (to a woman)", hebrew: "בְּרוּכָה הַבָּאָה", wrong: ["בָּרוּךְ הַבָּאָה", "בְּרוּכָה הַבָּא", "בְּרוּכוֹת הַבָּאָה"] },
      { english: "welcome to Israel (to a group)", hebrew: "בְּרוּכִים הַבָּאִים לְיִשְׂרָאֵל", wrong: ["בְּרוּכִים הַבָּא לְיִשְׂרָאֵל", "בְּרוּכִים הַבָּאִים מִיִּשְׂרָאֵל", "בָּרוּךְ הַבָּאִים לְיִשְׂרָאֵל"] },
      // More nouns from the roots
      { english: "pedestrians", hebrew: "הוֹלְכֵי רֶגֶל", wrong: ["הוֹלְכִים רֶגֶל", "הוֹלֵךְ רֶגֶל", "רַגְלֵי הוֹלְכִים"] },
      { english: "a long walk", hebrew: "הֲלִיכָה אֲרֻכָּה", wrong: ["הֲלִיכָה אָרֹךְ", "הֲלִיכוֹת אֲרֻכָּה", "הוֹלֵךְ אָרֹךְ"] },
      { english: "a parade", hebrew: "תַּהֲלוּכָה", wrong: ["הֲלִיכָה", "תַּהֲלוּכוֹת", "הוֹלֶכֶת"] },
      { english: "the Purim parade", hebrew: "תַּהֲלוּכַת פּוּרִים", wrong: ["תַּהֲלוּכָה פּוּרִים", "פּוּרִים תַּהֲלוּכָה", "הֲלִיכַת פּוּרִים"] },
      { english: "an introduction to the book", hebrew: "מָבוֹא לַסֵּפֶר", wrong: ["מָבוֹא מֵהַסֵּפֶר", "מָבוֹא אֶת הַסֵּפֶר", "הֲלִיכָה לַסֵּפֶר"] },
      // לְהָבִיא (to bring) is also from ב־ו־א: "to make something come"
      // Everyday sentences
      { english: "I walk to school every day", hebrew: "אֲנִי הוֹלֵךְ לְבֵית הַסֵּפֶר כָּל יוֹם", wrong: ["אֲנִי הוֹלֶכֶת לְבֵית הַסֵּפֶר כָּל יוֹם", "אֲנִי הוֹלֵךְ בְּבֵית הַסֵּפֶר כָּל יוֹם", "אֲנִי הוֹלֵךְ אֶת בֵּית הַסֵּפֶר כָּל יוֹם"], f: { hebrew: "אֲנִי הוֹלֶכֶת לְבֵית הַסֵּפֶר כָּל יוֹם", wrong: ["אֲנִי הוֹלֵךְ לְבֵית הַסֵּפֶר כָּל יוֹם", "אֲנִי הוֹלֶכֶת בְּבֵית הַסֵּפֶר כָּל יוֹם", "אֲנִי הוֹלֶכֶת אֶת בֵּית הַסֵּפֶר כָּל יוֹם"] } },
      { english: "where are you (m.) going?", hebrew: "לְאָן אַתָּה הוֹלֵךְ?", wrong: ["מֵאֵיפֹה אַתָּה הוֹלֵךְ?", "לְאָן אַתָּה בָּא?", "לְאָן אַתְּ הוֹלֵךְ?"] },
      { english: "where do you (f.) come from?", hebrew: "מֵאֵיפֹה אַתְּ בָּאָה?", wrong: ["לְאָן אַתְּ בָּאָה?", "מֵאֵיפֹה אַתָּה בָּאָה?", "מֵאֵיפֹה אַתְּ הוֹלֶכֶת?"] },
      { english: "yesterday I went to the mall", hebrew: "אֶתְמוֹל הָלַכְתִּי לַקַּנְיוֹן", wrong: ["אֶתְמוֹל הָלַכְתִּי בַּקַּנְיוֹן", "אֶתְמוֹל אֵלֵךְ לַקַּנְיוֹן", "אֶתְמוֹל הָלַכְנוּ לַקַּנְיוֹן"] },
      { english: "they (m.) came to class late", hebrew: "הֵם בָּאוּ לַשִּׁעוּר מְאֻחָר", wrong: ["הֵם בָּאוּ מֵהַשִּׁעוּר מְאֻחָר", "הֵם בָּאוּ בַּשִּׁעוּר מְאֻחָר", "הֵם הָלְכוּ לַשִּׁעוּר מְאֻחָר"] },
      { english: "he went with them", hebrew: "הוּא הָלַךְ אִתָּם", wrong: ["הוּא הָלַךְ אוֹתָם", "הוּא הָלַךְ לָהֶם", "הוּא הוֹלֵךְ אִתָּם"] },
      { english: "Dana is coming over to our place tonight", hebrew: "דָּנָה בָּאָה אֵלֵינוּ הָעֶרֶב", wrong: ["דָּנָה בָּאָה לָנוּ הָעֶרֶב", "דָּנָה בָּא אֵלֵינוּ הָעֶרֶב", "דָּנָה הוֹלֶכֶת אֵלֵינוּ הָעֶרֶב"] },
      { english: "do you (m.) want to come with us?", hebrew: "אַתָּה רוֹצֶה לָבוֹא אִתָּנוּ?", wrong: ["אַתָּה רוֹצֶה בָּא אִתָּנוּ?", "אַתָּה רוֹצֶה לָבוֹא אוֹתָנוּ?", "אַתָּה רוֹצֶה לָבוֹא לָנוּ?"] },
      { english: "we walked a lot on the trip", hebrew: "הָלַכְנוּ הַרְבֵּה בַּטִּיּוּל", wrong: ["הָלַכְנוּ הַרְבֵּה לַטִּיּוּל", "הָלַכְתִּי הַרְבֵּה בַּטִּיּוּל", "נֵלֵךְ הַרְבֵּה בַּטִּיּוּל"] },
      { english: "the people who came to the party", hebrew: "הָאֲנָשִׁים שֶׁבָּאוּ לַמְּסִבָּה", wrong: ["הָאֲנָשִׁים שֶׁבָּא לַמְּסִבָּה", "הָאֲנָשִׁים שֶׁבָּאוּ מֵהַמְּסִבָּה", "הָאֲנָשִׁים בָּאוּ לַמְּסִבָּה"] },
      { english: "how's it going? (slang)", hebrew: "אֵיךְ הוֹלֵךְ?", wrong: ["אֵיךְ הוֹלֶכֶת?", "אֵיךְ בָּא?", "אֵיךְ הָלַךְ?"] },
      { english: "I feel like pizza (slang)", hebrew: "בָּא לִי פִּיצָה", wrong: ["בָּא אוֹתִי פִּיצָה", "אֲנִי בָּא פִּיצָה", "הוֹלֵךְ לִי פִּיצָה"] },
      { english: "I don't feel like going (slang)", hebrew: "לֹא בָּא לִי לָלֶכֶת", wrong: ["לֹא בָּא לִי הוֹלֵךְ", "לֹא בָּא אוֹתִי לָלֶכֶת", "לֹא בָּא לִי לָבוֹא"] },
    ],
  },
  {
    // לְחַכּוֹת (wait) is the פִּעֵל pattern. It takes לְ for the person, NOT אֶת: מְחַכֶּה לִי (not אוֹתִי).
    id: "root-hkh", kind: "root", pattern: "piel", icon: "🌱", english: "Root ח־כ־ה: wait", hebrew: "שֹׁרֶשׁ ח־כ־ה: לְחַכּוֹת",
    words: [
      { english: "to wait", hebrew: "לְחַכּוֹת", wrong: ["מְחַכֶּה", "לַעֲזֹר", "לָלֶכֶת"] },
      { english: "he waits", hebrew: "הוּא מְחַכֶּה", wrong: ["הוּא מְחַכָּה", "הוּא מְחַכִּים", "הוּא חִכָּה"] },
      { english: "she waits", hebrew: "הִיא מְחַכָּה", wrong: ["הִיא מְחַכֶּה", "הִיא מְחַכּוֹת", "הִיא חִכְּתָה"] },
      { english: "they (m.) wait", hebrew: "הֵם מְחַכִּים", wrong: ["הֵם מְחַכּוֹת", "הֵם מְחַכֶּה", "הֵם חִכּוּ"] },
      { english: "he waits for the bus", hebrew: "הוּא מְחַכֶּה לָאוֹטוֹבּוּס", wrong: ["הוּא מְחַכֶּה אֶת הָאוֹטוֹבּוּס", "הוּא מְחַכֶּה בָּאוֹטוֹבּוּס", "הוּא מְחַכֶּה עַל הָאוֹטוֹבּוּס"] },
      { english: "she waits at the bus stop", hebrew: "הִיא מְחַכָּה בַּתַּחֲנָה", wrong: ["הִיא מְחַכָּה לַתַּחֲנָה", "הִיא מְחַכָּה אֶת הַתַּחֲנָה", "הִיא מְחַכָּה מֵהַתַּחֲנָה"] },
      { english: "they (m.) wait for Dana", hebrew: "הֵם מְחַכִּים לְדָנָה", wrong: ["הֵם מְחַכִּים אֶת דָּנָה", "הֵם מְחַכִּים עִם דָּנָה", "הֵם מְחַכִּים בְּדָנָה"] },
      { english: "he waits for me", hebrew: "הוּא מְחַכֶּה לִי", wrong: ["הוּא מְחַכֶּה אוֹתִי", "הוּא מְחַכֶּה אֲנִי", "הוּא מְחַכֶּה לוֹ"] },
      { english: "I wait", hebrew: "אֲנִי מְחַכֶּה", wrong: ["אֲנִי מְחַכָּה", "אֲנִי מְחַכִּים", "אֲנִי חִכִּיתִי"], f: { hebrew: "אֲנִי מְחַכָּה", wrong: ["אֲנִי מְחַכֶּה", "אֲנִי מְחַכּוֹת", "אֲנִי חִכִּיתִי"] } },
      { english: "you (m.) wait", hebrew: "אַתָּה מְחַכֶּה", wrong: ["אַתָּה מְחַכָּה", "אַתָּה מְחַכִּים", "אַתָּה חִכִּיתָ"] },
      { english: "you (f.) wait", hebrew: "אַתְּ מְחַכָּה", wrong: ["אַתְּ מְחַכֶּה", "אַתְּ מְחַכּוֹת", "אַתְּ חִכִּית"] },
      { english: "we wait", hebrew: "אֲנַחְנוּ מְחַכִּים", wrong: ["אֲנַחְנוּ מְחַכֶּה", "אֲנַחְנוּ חִכִּינוּ", "הֵם מְחַכִּים"], f: { hebrew: "אֲנַחְנוּ מְחַכּוֹת", wrong: ["אֲנַחְנוּ מְחַכָּה", "אֲנַחְנוּ חִכִּינוּ", "הֵן מְחַכּוֹת"] } },
      { english: "they (f.) wait", hebrew: "הֵן מְחַכּוֹת", wrong: ["הֵן מְחַכִּים", "הֵן מְחַכָּה", "הֵן חִכּוּ"] },
      { english: "he waited", hebrew: "הוּא חִכָּה", wrong: ["הוּא מְחַכֶּה", "הוּא יְחַכֶּה", "הִיא חִכְּתָה"] },
      { english: "I waited", hebrew: "אֲנִי חִכִּיתִי", wrong: ["אֲנִי אֲחַכֶּה", "אֲנַחְנוּ חִכִּינוּ", "אֲנִי חִכָּה"] },
      { english: "she will wait", hebrew: "הִיא תְּחַכֶּה", wrong: ["הִיא חִכְּתָה", "הִיא מְחַכָּה", "הוּא יְחַכֶּה"] },
      { english: "we waited an hour", hebrew: "אֲנַחְנוּ חִכִּינוּ שָׁעָה", wrong: ["אֲנַחְנוּ נְחַכֶּה שָׁעָה", "הֵם חִכּוּ שָׁעָה", "אֲנַחְנוּ חִכִּיתִי שָׁעָה"] },
      { english: "we will wait for you (m.)", hebrew: "אֲנַחְנוּ נְחַכֶּה לְךָ", wrong: ["אֲנַחְנוּ נְחַכֶּה אוֹתְךָ", "אֲנַחְנוּ חִכִּינוּ לְךָ", "אֲנַחְנוּ נְחַכֶּה לָךְ"] },
      { english: "wait a moment! (to a girl)", hebrew: "חַכִּי רֶגַע", wrong: ["חַכֶּה רֶגַע", "מְחַכָּה רֶגַע", "חַכּוּ רֶגַע"] },
      // ח־כ־ה in sentences: מְחַכֶּה לְ (waits FOR), מְחַכֶּה בְּ (waits IN/AT)
      { english: "she waits for her friend (f.)", hebrew: "הִיא מְחַכָּה לַחֲבֵרָה שֶׁלָּהּ", wrong: ["הִיא מְחַכָּה אֶת הַחֲבֵרָה שֶׁלָּהּ", "הִיא מְחַכָּה עִם הַחֲבֵרָה שֶׁלָּהּ", "הִיא מְחַכֶּה לַחֲבֵרָה שֶׁלָּהּ"] },
      { english: "we wait in line", hebrew: "אֲנַחְנוּ מְחַכִּים בַּתּוֹר", wrong: ["אֲנַחְנוּ מְחַכִּים עַל הַתּוֹר", "אֲנַחְנוּ מְחַכִּים אֶת הַתּוֹר", "אֲנַחְנוּ מְחַכֶּה בַּתּוֹר"], f: { hebrew: "אֲנַחְנוּ מְחַכּוֹת בַּתּוֹר", wrong: ["אֲנַחְנוּ מְחַכּוֹת עַל הַתּוֹר", "אֲנַחְנוּ מְחַכּוֹת אֶת הַתּוֹר", "אֲנַחְנוּ מְחַכָּה בַּתּוֹר"] } },
      { english: "I'm waiting for an answer", hebrew: "אֲנִי מְחַכֶּה לִתְשׁוּבָה", wrong: ["אֲנִי מְחַכֶּה תְּשׁוּבָה", "אֲנִי מְחַכֶּה אֶת הַתְּשׁוּבָה", "אֲנִי מְחַכָּה לִתְשׁוּבָה"], f: { hebrew: "אֲנִי מְחַכָּה לִתְשׁוּבָה", wrong: ["אֲנִי מְחַכָּה תְּשׁוּבָה", "אֲנִי מְחַכָּה אֶת הַתְּשׁוּבָה", "אֲנִי מְחַכֶּה לִתְשׁוּבָה"] } },
      { english: "they (f.) wait outside the classroom", hebrew: "הֵן מְחַכּוֹת מִחוּץ לַכִּתָּה", wrong: ["הֵן מְחַכּוֹת לַכִּתָּה", "הֵן מְחַכִּים מִחוּץ לַכִּתָּה", "הֵן מְחַכָּה מִחוּץ לַכִּתָּה"] },
      { english: "how long have you (m.) been waiting?", hebrew: "כַּמָּה זְמַן אַתָּה מְחַכֶּה?", wrong: ["כַּמָּה זְמַן אַתָּה מְחַכָּה?", "כַּמָּה זְמַן אַתָּה עוֹזֵר?", "כַּמָּה זְמַן אַתָּה מְחַכִּים?"] },
      { english: "Dad is waiting for us in the car", hebrew: "אַבָּא מְחַכֶּה לָנוּ בַּמְּכוֹנִית", wrong: ["אַבָּא מְחַכֶּה אוֹתָנוּ בַּמְּכוֹנִית", "אַבָּא מְחַכֶּה לָנוּ לַמְּכוֹנִית", "אַבָּא מְחַכָּה לָנוּ בַּמְּכוֹנִית"] },
      { english: "I'm looking forward to the trip", hebrew: "אֲנִי מְחַכֶּה לַטִּיּוּל", wrong: ["אֲנִי מְחַכֶּה אֶת הַטִּיּוּל", "אֲנִי מְחַכֶּה בַּטִּיּוּל", "אֲנִי מְחַכָּה לַטִּיּוּל"], f: { hebrew: "אֲנִי מְחַכָּה לַטִּיּוּל", wrong: ["אֲנִי מְחַכָּה אֶת הַטִּיּוּל", "אֲנִי מְחַכָּה בַּטִּיּוּל", "אֲנִי מְחַכֶּה לַטִּיּוּל"] } },
    ],
  },
  {
    // לַעֲזֹר (help) is the פָּעַל pattern. It takes לְ for the person, NOT אֶת: עוֹזֵר לִי (not אוֹתִי).
    id: "root-azr", kind: "root", pattern: "paal", icon: "🌱", english: "Root ע־ז־ר: help", hebrew: "שֹׁרֶשׁ ע־ז־ר: לַעֲזֹר",
    words: [
      { english: "to help", hebrew: "לַעֲזֹר", wrong: ["עוֹזֵר", "לְחַכּוֹת", "עֶזְרָה"] },
      { english: "he helps", hebrew: "הוּא עוֹזֵר", wrong: ["הוּא עוֹזֶרֶת", "הוּא עוֹזְרִים", "הוּא עָזַר"] },
      { english: "she helps", hebrew: "הִיא עוֹזֶרֶת", wrong: ["הִיא עוֹזֵר", "הִיא עוֹזְרוֹת", "הִיא עָזְרָה"] },
      { english: "they (m.) help", hebrew: "הֵם עוֹזְרִים", wrong: ["הֵם עוֹזְרוֹת", "הֵם עוֹזֵר", "הֵם עָזְרוּ"] },
      { english: "help (the noun)", hebrew: "עֶזְרָה", wrong: ["עוֹזֵר", "לַעֲזֹר", "עוֹזֶרֶת"] },
      { english: "an assistant (m.)", hebrew: "עוֹזֵר", wrong: ["עֶזְרָה", "עוֹזֶרֶת", "עוֹזְרִים"] },
      { english: "first aid", hebrew: "עֶזְרָה רִאשׁוֹנָה", wrong: ["עֶזְרָה רִאשׁוֹן", "עוֹזֵר רִאשׁוֹן", "רִאשׁוֹנָה עֶזְרָה"] },
      { english: "he helps Dana", hebrew: "הוּא עוֹזֵר לְדָנָה", wrong: ["הוּא עוֹזֵר אֶת דָּנָה", "הוּא עוֹזֵר עַל דָּנָה", "הוּא עוֹזֵר בְּדָנָה"] },
      { english: "they (m.) help me", hebrew: "הֵם עוֹזְרִים לִי", wrong: ["הֵם עוֹזְרִים אוֹתִי", "הֵם עוֹזְרִים אֲנִי", "הֵם עוֹזְרִים לוֹ"] },
      { english: "she helps with the homework", hebrew: "הִיא עוֹזֶרֶת בְּשִׁעוּרֵי הַבַּיִת", wrong: ["הִיא עוֹזֶרֶת אֶת שִׁעוּרֵי הַבַּיִת", "הִיא עוֹזֶרֶת לְשִׁעוּרֵי הַבַּיִת", "הִיא עוֹזֶרֶת מִשִּׁעוּרֵי הַבַּיִת"] },
      { english: "I help", hebrew: "אֲנִי עוֹזֵר", wrong: ["אֲנִי עוֹזֶרֶת", "אֲנִי עוֹזְרִים", "אֲנִי עָזַרְתִּי"], f: { hebrew: "אֲנִי עוֹזֶרֶת", wrong: ["אֲנִי עוֹזֵר", "אֲנִי עוֹזְרוֹת", "אֲנִי עָזַרְתִּי"] } },
      { english: "you (m.) help", hebrew: "אַתָּה עוֹזֵר", wrong: ["אַתָּה עוֹזֶרֶת", "אַתָּה עוֹזְרִים", "אַתָּה עָזַרְתָּ"] },
      { english: "you (f.) help", hebrew: "אַתְּ עוֹזֶרֶת", wrong: ["אַתְּ עוֹזֵר", "אַתְּ עוֹזְרוֹת", "אַתְּ עָזַרְתְּ"] },
      { english: "we help", hebrew: "אֲנַחְנוּ עוֹזְרִים", wrong: ["אֲנַחְנוּ עוֹזֵר", "אֲנַחְנוּ עָזַרְנוּ", "הֵם עוֹזְרִים"], f: { hebrew: "אֲנַחְנוּ עוֹזְרוֹת", wrong: ["אֲנַחְנוּ עוֹזֶרֶת", "אֲנַחְנוּ עָזַרְנוּ", "הֵן עוֹזְרוֹת"] } },
      { english: "they (f.) help", hebrew: "הֵן עוֹזְרוֹת", wrong: ["הֵן עוֹזְרִים", "הֵן עוֹזֶרֶת", "הֵן עָזְרוּ"] },
      { english: "she helped", hebrew: "הִיא עָזְרָה", wrong: ["הִיא עוֹזֶרֶת", "הִיא תַּעֲזֹר", "הוּא עָזַר"] },
      { english: "I will help you (m.)", hebrew: "אֲנִי אֶעֱזֹר לְךָ", wrong: ["אֲנִי אֶעֱזֹר אוֹתְךָ", "אֲנִי עָזַרְתִּי לְךָ", "אֲנִי אֶעֱזֹר לָךְ"] },
      { english: "they (m.) helped us", hebrew: "הֵם עָזְרוּ לָנוּ", wrong: ["הֵם עָזְרוּ אוֹתָנוּ", "הֵם עוֹזְרִים לָנוּ", "הֵם עָזְרוּ לָהֶם"] },
      // ע־ז־ר: nouns — עֶזְרָה (help), עוֹזֵר / עוֹזֶרֶת (assistant)
      { english: "an assistant (f.)", hebrew: "עוֹזֶרֶת", wrong: ["עוֹזֵר", "עֶזְרָה", "עוֹזְרוֹת"] },
      { english: "the teacher's assistant (f.)", hebrew: "הָעוֹזֶרֶת שֶׁל הַמּוֹרָה", wrong: ["הָעֶזְרָה שֶׁל הַמּוֹרָה", "הָעוֹזֵר שֶׁל הַמּוֹרָה", "הָעוֹזְרוֹת שֶׁל הַמּוֹרָה"] },
      { english: "thanks for the help", hebrew: "תּוֹדָה עַל הָעֶזְרָה", wrong: ["תּוֹדָה בָּעֶזְרָה", "תּוֹדָה עַל הָעוֹזֵר", "תּוֹדָה עַל לַעֲזֹר"] },
      { english: "with the help of a friend", hebrew: "בְּעֶזְרַת חָבֵר", wrong: ["לְעֶזְרַת חָבֵר", "בְּעֶזְרָה חָבֵר", "בְּעוֹזֵר חָבֵר"] },
      { english: "do you (f.) need help?", hebrew: "אַתְּ צְרִיכָה עֶזְרָה?", wrong: ["אַתְּ צְרִיכָה עוֹזֶרֶת?", "אַתְּ צְרִיכָה לַעֲזֹר?", "אַתְּ צָרִיךְ עֶזְרָה?"] },
      { english: "she asks for help", hebrew: "הִיא מְבַקֶּשֶׁת עֶזְרָה", wrong: ["הִיא מְבַקֶּשֶׁת עוֹזֶרֶת", "הִיא מְבַקֶּשֶׁת לַעֲזֹר", "הִיא מְבַקֶּשֶׁת עוֹזֵר"] },
      // ע־ז־ר in sentences: עוֹזֵר לְ (helps someone), עוֹזֵר בְּ (helps WITH something), עוֹזֵר לְ + infinitive
      { english: "can you (m.) help me?", hebrew: "אַתָּה יָכוֹל לַעֲזֹר לִי?", wrong: ["אַתָּה יָכוֹל לַעֲזֹר אוֹתִי?", "אַתָּה יָכוֹל עוֹזֵר לִי?", "אַתָּה יְכוֹלָה לַעֲזֹר לִי?"] },
      { english: "she helps Mom in the kitchen", hebrew: "הִיא עוֹזֶרֶת לְאִמָּא בַּמִּטְבָּח", wrong: ["הִיא עוֹזֶרֶת אֶת אִמָּא בַּמִּטְבָּח", "הִיא עוֹזֶרֶת לְאִמָּא לַמִּטְבָּח", "הִיא עוֹזֵר לְאִמָּא בַּמִּטְבָּח"] },
      { english: "he helps me carry the bag", hebrew: "הוּא עוֹזֵר לִי לִסְחֹב אֶת הַתִּיק", wrong: ["הוּא עוֹזֵר אוֹתִי לִסְחֹב אֶת הַתִּיק", "הוּא עוֹזֵר לִי סוֹחֵב אֶת הַתִּיק", "הוּא עוֹזֵר לִי לִסְחֹב הַתִּיק"] },
      { english: "I help my brother with math", hebrew: "אֲנִי עוֹזֵר לְאָחִי בְּמָתֵמָטִיקָה", wrong: ["אֲנִי עוֹזֵר אֶת אָחִי בְּמָתֵמָטִיקָה", "אֲנִי עוֹזֵר לְאָחִי לְמָתֵמָטִיקָה", "אֲנִי עוֹזֶרֶת לְאָחִי בְּמָתֵמָטִיקָה"], f: { hebrew: "אֲנִי עוֹזֶרֶת לְאָחִי בְּמָתֵמָטִיקָה", wrong: ["אֲנִי עוֹזֶרֶת אֶת אָחִי בְּמָתֵמָטִיקָה", "אֲנִי עוֹזֶרֶת לְאָחִי לְמָתֵמָטִיקָה", "אֲנִי עוֹזֵר לְאָחִי בְּמָתֵמָטִיקָה"] } },
      { english: "we help the new students", hebrew: "אֲנַחְנוּ עוֹזְרִים לַתַּלְמִידִים הַחֲדָשִׁים", wrong: ["אֲנַחְנוּ עוֹזְרִים אֶת הַתַּלְמִידִים הַחֲדָשִׁים", "אֲנַחְנוּ עוֹזְרִים לְתַלְמִידִים הַחֲדָשִׁים", "אֲנַחְנוּ עוֹזֵר לַתַּלְמִידִים הַחֲדָשִׁים"], f: { hebrew: "אֲנַחְנוּ עוֹזְרוֹת לַתַּלְמִידִים הַחֲדָשִׁים", wrong: ["אֲנַחְנוּ עוֹזְרוֹת אֶת הַתַּלְמִידִים הַחֲדָשִׁים", "אֲנַחְנוּ עוֹזְרוֹת לְתַלְמִידִים הַחֲדָשִׁים", "אֲנַחְנוּ עוֹזֶרֶת לַתַּלְמִידִים הַחֲדָשִׁים"] } },
      { english: "it helps me", hebrew: "זֶה עוֹזֵר לִי", wrong: ["זֶה עוֹזֵר אוֹתִי", "זֶה עֶזְרָה לִי", "זֶה עוֹזֶרֶת לִי"] },
      { english: "friends help each other", hebrew: "חֲבֵרִים עוֹזְרִים זֶה לָזֶה", wrong: ["חֲבֵרִים עוֹזְרִים זֶה אֶת זֶה", "חֲבֵרִים עוֹזֵר זֶה לָזֶה", "חֲבֵרִים עוֹזְרִים זֶה עִם זֶה"] },
      { english: "who helps you (m.)?", hebrew: "מִי עוֹזֵר לְךָ?", wrong: ["מִי עוֹזֵר אוֹתְךָ?", "מִי עוֹזֵר לָךְ?", "מִי עֶזְרָה לְךָ?"] },
    ],
  },
  {
    id: "root-kra", kind: "root", pattern: "paal", icon: "🌱", english: "Root ק־ר־א: read, call", hebrew: "שֹׁרֶשׁ ק־ר־א: לִקְרֹא",
    words: [
      { english: "to read", hebrew: "לִקְרֹא", wrong: ["קוֹרֵא", "קְרִיאָה", "לִכְתֹּב"] },
      { english: "he reads", hebrew: "הוּא קוֹרֵא", wrong: ["הוּא קוֹרֵאת", "הוּא קוֹרְאִים", "הוּא קָרָא"] },
      { english: "she reads", hebrew: "הִיא קוֹרֵאת", wrong: ["הִיא קוֹרֵא", "הִיא קוֹרְאוֹת", "הִיא קָרְאָה"] },
      { english: "they (m.) read", hebrew: "הֵם קוֹרְאִים", wrong: ["הֵם קוֹרְאוֹת", "הֵם קוֹרֵא", "הֵם קָרְאוּ"] },
      { english: "they (f.) read", hebrew: "הֵן קוֹרְאוֹת", wrong: ["הֵן קוֹרְאִים", "הֵן קוֹרֵאת", "הֵן קָרְאוּ"] },
      { english: "reading (the activity)", hebrew: "קְרִיאָה", wrong: ["קוֹרֵא", "מִקְרָא", "כְּתִיבָה"] },
      { english: "the Bible (Scripture)", hebrew: "מִקְרָא", wrong: ["קְרִיאָה", "מִכְתָּב", "סִפּוּר"] },
      // קוֹרֵא + אֶת (reads THE …) / nothing (reads A …) / עַל (about) / בְּ (where) / לְ (calls someone) / קוֹרְאִים לִי = my name is
      { english: "she reads the book", hebrew: "הִיא קוֹרֵאת אֶת הַסֵּפֶר", wrong: ["הִיא קוֹרֵאת הַסֵּפֶר", "הִיא קוֹרֵאת לַסֵּפֶר", "הִיא קוֹרֵאת עַל הַסֵּפֶר"] },
      { english: "he reads a book", hebrew: "הוּא קוֹרֵא סֵפֶר", wrong: ["הוּא קוֹרֵא אֶת סֵפֶר", "הוּא קוֹרֵא לְסֵפֶר", "הוּא קוֹרֵאת סֵפֶר"] },
      { english: "she reads about Israel", hebrew: "הִיא קוֹרֵאת עַל יִשְׂרָאֵל", wrong: ["הִיא קוֹרֵאת אֶת יִשְׂרָאֵל", "הִיא קוֹרֵאת לְיִשְׂרָאֵל", "הִיא קוֹרֵאת בְּיִשְׂרָאֵל"] },
      { english: "he reads in the library", hebrew: "הוּא קוֹרֵא בַּסִּפְרִיָּה", wrong: ["הוּא קוֹרֵא לַסִּפְרִיָּה", "הוּא קוֹרֵא אֶת הַסִּפְרִיָּה", "הוּא קוֹרֵא מֵהַסִּפְרִיָּה"] },
      { english: "the teacher (m.) calls Dana", hebrew: "הַמּוֹרֶה קוֹרֵא לְדָנָה", wrong: ["הַמּוֹרֶה קוֹרֵא אֶת דָּנָה", "הַמּוֹרֶה קוֹרֵא עִם דָּנָה", "הַמּוֹרֶה קוֹרֵאת לְדָנָה"] },
      { english: "my name is Noam (they call me Noam)", hebrew: "קוֹרְאִים לִי נוֹעַם", wrong: ["קוֹרְאִים אוֹתִי נוֹעַם", "קוֹרֵא לִי נוֹעַם", "קוֹרְאִים לוֹ נוֹעַם"] },
      // The describing word from the root (קָרִיא = readable) vs. the action (קוֹרֵא = reads)
      { english: "readable, legible (m.)", hebrew: "קָרִיא", wrong: ["קוֹרֵא", "קְרִיאָה", "קָרָא"] },
      { english: "the handwriting is not legible", hebrew: "הַכְּתָב לֹא קָרִיא", wrong: ["הַכְּתָב לֹא קוֹרֵא", "הַכְּתָב לֹא קְרִיאָה", "הַכְּתָב לֹא קָרָא"] },
      // ----- More practice (2026-11-12) -----
      // The rest of the present tense
      { english: "I read", hebrew: "אֲנִי קוֹרֵא", wrong: ["אֲנִי קוֹרֵאת", "אֲנִי קוֹרְאִים", "אֲנִי קָרָאתִי"], f: { hebrew: "אֲנִי קוֹרֵאת", wrong: ["אֲנִי קוֹרֵא", "אֲנִי קוֹרְאוֹת", "אֲנִי קָרָאתִי"] } },
      { english: "you (m.) read", hebrew: "אַתָּה קוֹרֵא", wrong: ["אַתָּה קוֹרֵאת", "אַתָּה קוֹרְאִים", "אַתָּה קָרָאתָ"] },
      { english: "you (f.) read", hebrew: "אַתְּ קוֹרֵאת", wrong: ["אַתְּ קוֹרֵא", "אַתְּ קוֹרְאוֹת", "אַתְּ קָרָאת"] },
      { english: "we read", hebrew: "אֲנַחְנוּ קוֹרְאִים", wrong: ["אֲנַחְנוּ קוֹרֵא", "אֲנַחְנוּ קָרָאנוּ", "הֵם קוֹרְאִים"], f: { hebrew: "אֲנַחְנוּ קוֹרְאוֹת", wrong: ["אֲנַחְנוּ קוֹרֵאת", "אֲנַחְנוּ קָרָאנוּ", "הֵן קוֹרְאוֹת"] } },
      { english: "I love to read", hebrew: "אֲנִי אוֹהֵב לִקְרֹא", wrong: ["אֲנִי אוֹהֵב קוֹרֵא", "אֲנִי אוֹהֵב קָרָא", "אֲנִי אוֹהֶבֶת לִקְרֹא"], f: { hebrew: "אֲנִי אוֹהֶבֶת לִקְרֹא", wrong: ["אֲנִי אוֹהֶבֶת קוֹרֵאת", "אֲנִי אוֹהֶבֶת קָרְאָה", "אֲנִי אוֹהֵב לִקְרֹא"] } },
      // Past and future
      { english: "he read a story", hebrew: "הוּא קָרָא סִפּוּר", wrong: ["הוּא קוֹרֵא סִפּוּר", "הוּא יִקְרָא סִפּוּר", "הוּא קָרָא אֶת סִפּוּר"] },
      { english: "I read the book yesterday", hebrew: "אֶתְמוֹל קָרָאתִי אֶת הַסֵּפֶר", wrong: ["אֶתְמוֹל אֶקְרָא אֶת הַסֵּפֶר", "אֶתְמוֹל קָרָאתִי הַסֵּפֶר", "אֶתְמוֹל קָרָאתִי לַסֵּפֶר"] },
      { english: "she will read", hebrew: "הִיא תִּקְרָא", wrong: ["הִיא קָרְאָה", "הִיא קוֹרֵאת", "הוּא יִקְרָא"] },
      { english: "tomorrow we will read the newspaper", hebrew: "מָחָר נִקְרָא אֶת הָעִתּוֹן", wrong: ["מָחָר קָרָאנוּ אֶת הָעִתּוֹן", "מָחָר נִקְרָא הָעִתּוֹן", "מָחָר נִקְרָא לָעִתּוֹן"] },
      { english: "I didn't read the message", hebrew: "לֹא קָרָאתִי אֶת הַהוֹדָעָה", wrong: ["לֹא קָרָאתִי הַהוֹדָעָה", "לֹא קָרָאתִי לַהוֹדָעָה", "לֹא אֶקְרָא אֶת הַהוֹדָעָה"] },
      { english: "she read that the trip is tomorrow", hebrew: "הִיא קָרְאָה שֶׁהַטִּיּוּל מָחָר", wrong: ["הִיא קָרְאָה אֶת הַטִּיּוּל מָחָר", "הִיא קָרְאָה עַל הַטִּיּוּל מָחָר", "הִיא קוֹרֵאת שֶׁהַטִּיּוּל מָחָר"] },
      { english: "they (m.) will call us", hebrew: "הֵם יִקְרְאוּ לָנוּ", wrong: ["הֵם יִקְרְאוּ אוֹתָנוּ", "הֵם קָרְאוּ לָנוּ", "הֵם יִקְרְאוּ לָהֶם"] },
      // More nouns from the root
      { english: "a reader (m.)", hebrew: "קוֹרֵא", wrong: ["קְרִיאָה", "קוֹרְאִים", "מִקְרָא"] },
      { english: "the readers (m.)", hebrew: "הַקּוֹרְאִים", wrong: ["הַקְּרִיאוֹת", "הַקּוֹרֵא", "הַקּוֹרְאוֹת"] },
      { english: "a school reader (reading book)", hebrew: "מִקְרָאָה", wrong: ["מִקְרָא", "קְרִיאָה", "קוֹרֵאת"] },
      { english: "reading comprehension", hebrew: "הֲבָנַת הַנִּקְרָא", wrong: ["הֲבָנַת הַקּוֹרֵא", "הֲבָנַת הַקְּרִיאוֹת", "הֲבָנַת הַקָּרִיא"] },
      { english: "a call for help", hebrew: "קְרִיאָה לְעֶזְרָה", wrong: ["קוֹרֵא לְעֶזְרָה", "קְרִיאָה בְּעֶזְרָה", "מִקְרָא לְעֶזְרָה"] },
      { english: "an exclamation mark", hebrew: "סִימַן קְרִיאָה", wrong: ["סִימַן שְׁאֵלָה", "סִימָן קְרִיאָה", "סִימַן קוֹרֵא"] },
      // More describing words: feminine and plural (קָרִיא, קְרִיאָה, קְרִיאִים, קְרִיאוֹת)
      { english: "legible (f.)", hebrew: "קְרִיאָה", wrong: ["קָרִיא", "קְרִיאוֹת", "קוֹרֵאת"] },
      { english: "legible (m. pl.)", hebrew: "קְרִיאִים", wrong: ["קְרִיאוֹת", "קָרִיא", "קוֹרְאִים"] },
      { english: "legible (f. pl.)", hebrew: "קְרִיאוֹת", wrong: ["קְרִיאִים", "קְרִיאָה", "קוֹרְאוֹת"] },
      { english: "legible handwriting", hebrew: "כְּתָב קָרִיא", wrong: ["כְּתָב קְרִיאָה", "קָרִיא כְּתָב", "כְּתָב קוֹרֵא"] },
      { english: "the sign is legible", hebrew: "הַשֶּׁלֶט קָרִיא", wrong: ["הַשֶּׁלֶט קְרִיאָה", "הַשֶּׁלֶט קוֹרֵא", "הַשֶּׁלֶט קְרִיאִים"] },
      { english: "the answer is not legible", hebrew: "הַתְּשׁוּבָה לֹא קְרִיאָה", wrong: ["הַתְּשׁוּבָה לֹא קָרִיא", "הַתְּשׁוּבָה לֹא קוֹרֵאת", "הַתְּשׁוּבָה לֹא קְרִיאוֹת"] },
      { english: "the words are legible", hebrew: "הַמִּלִּים קְרִיאוֹת", wrong: ["הַמִּלִּים קְרִיאִים", "הַמִּלִּים קְרִיאָה", "הַמִּלִּים קוֹרְאוֹת"] },
      { english: "the numbers are not legible", hebrew: "הַמִּסְפָּרִים לֹא קְרִיאִים", wrong: ["הַמִּסְפָּרִים לֹא קְרִיאוֹת", "הַמִּסְפָּרִים לֹא קָרִיא", "הַמִּסְפָּרִים לֹא קוֹרְאִים"] },
      // Names: קוֹרְאִים לְ… / נִקְרָא (is called)
      { english: "her name is Maya (they call her Maya)", hebrew: "קוֹרְאִים לָהּ מָאיָה", wrong: ["קוֹרְאִים אוֹתָהּ מָאיָה", "קוֹרְאִים לוֹ מָאיָה", "קוֹרְאוֹת לָהּ מָאיָה"] },
      { english: "what's your (f.) name?", hebrew: "אֵיךְ קוֹרְאִים לָךְ?", wrong: ["אֵיךְ קוֹרְאִים אוֹתָךְ?", "אֵיךְ קוֹרְאִים לְךָ?", "אֵיךְ קוֹרֵאת לָךְ?"] },
      // Calling someone: קוֹרֵא לְ (not אֶת)
      { english: "Mom calls me to dinner", hebrew: "אִמָּא קוֹרֵאת לִי לַאֲרוּחַת עֶרֶב", wrong: ["אִמָּא קוֹרֵאת אוֹתִי לַאֲרוּחַת עֶרֶב", "אִמָּא קוֹרֵא לִי לַאֲרוּחַת עֶרֶב", "אִמָּא קוֹרֵאת לִי בַּאֲרוּחַת עֶרֶב"] },
      { english: "the guide (m.) calls the group", hebrew: "הַמַּדְרִיךְ קוֹרֵא לַקְּבוּצָה", wrong: ["הַמַּדְרִיךְ קוֹרֵא אֶת הַקְּבוּצָה", "הַמַּדְרִיךְ קוֹרֵא עִם הַקְּבוּצָה", "הַמַּדְרִיךְ קוֹרֵא בַּקְּבוּצָה"] },
      { english: "I'm calling the dog", hebrew: "אֲנִי קוֹרֵא לַכֶּלֶב", wrong: ["אֲנִי קוֹרֵא אֶת הַכֶּלֶב", "אֲנִי קוֹרֵא בַּכֶּלֶב", "אֲנִי קוֹרֵאת לַכֶּלֶב"], f: { hebrew: "אֲנִי קוֹרֵאת לַכֶּלֶב", wrong: ["אֲנִי קוֹרֵאת אֶת הַכֶּלֶב", "אֲנִי קוֹרֵאת בַּכֶּלֶב", "אֲנִי קוֹרֵא לַכֶּלֶב"] } },
      // Reading in context
      { english: "I read a story to my sister", hebrew: "אֲנִי קוֹרֵא סִפּוּר לַאֲחוֹתִי", wrong: ["אֲנִי קוֹרֵא סִפּוּר אֶת אֲחוֹתִי", "אֲנִי קוֹרֵא סִפּוּר עִם אֲחוֹתִי", "אֲנִי קוֹרֵאת סִפּוּר לַאֲחוֹתִי"], f: { hebrew: "אֲנִי קוֹרֵאת סִפּוּר לַאֲחוֹתִי", wrong: ["אֲנִי קוֹרֵאת סִפּוּר אֶת אֲחוֹתִי", "אֲנִי קוֹרֵאת סִפּוּר עִם אֲחוֹתִי", "אֲנִי קוֹרֵא סִפּוּר לַאֲחוֹתִי"] } },
      { english: "the students (m.) read the text aloud", hebrew: "הַתַּלְמִידִים קוֹרְאִים אֶת הַטֶּקְסְט בְּקוֹל", wrong: ["הַתַּלְמִידִים קוֹרְאִים הַטֶּקְסְט בְּקוֹל", "הַתַּלְמִידִים קוֹרְאִים אֶת הַטֶּקְסְט לְקוֹל", "הַתַּלְמִידִים קוֹרְאוֹת אֶת הַטֶּקְסְט בְּקוֹל"] },
      { english: "she reads in bed every night", hebrew: "הִיא קוֹרֵאת בַּמִּטָּה כָּל לַיְלָה", wrong: ["הִיא קוֹרֵאת לַמִּטָּה כָּל לַיְלָה", "הִיא קוֹרֵאת אֶת הַמִּטָּה כָּל לַיְלָה", "הִיא קוֹרֵא בַּמִּטָּה כָּל לַיְלָה"] },
      { english: "they (f.) read the sign", hebrew: "הֵן קוֹרְאוֹת אֶת הַשֶּׁלֶט", wrong: ["הֵן קוֹרְאוֹת הַשֶּׁלֶט", "הֵן קוֹרְאוֹת לַשֶּׁלֶט", "הֵן קוֹרְאִים אֶת הַשֶּׁלֶט"] },
      { english: "we read about the Golan", hebrew: "אֲנַחְנוּ קוֹרְאִים עַל הַגּוֹלָן", wrong: ["אֲנַחְנוּ קוֹרְאִים אֶת הַגּוֹלָן", "אֲנַחְנוּ קוֹרְאִים לַגּוֹלָן", "אֲנַחְנוּ קוֹרֵא עַל הַגּוֹלָן"], f: { hebrew: "אֲנַחְנוּ קוֹרְאוֹת עַל הַגּוֹלָן", wrong: ["אֲנַחְנוּ קוֹרְאוֹת אֶת הַגּוֹלָן", "אֲנַחְנוּ קוֹרְאוֹת לַגּוֹלָן", "אֲנַחְנוּ קוֹרֵאת עַל הַגּוֹלָן"] } },
      { english: "he reads the newspaper in the morning", hebrew: "הוּא קוֹרֵא אֶת הָעִתּוֹן בַּבֹּקֶר", wrong: ["הוּא קוֹרֵא הָעִתּוֹן בַּבֹּקֶר", "הוּא קוֹרֵא לָעִתּוֹן בַּבֹּקֶר", "הוּא קוֹרֵא אֶת הָעִתּוֹן לַבֹּקֶר"] },
      { english: "the book that she is reading is long", hebrew: "הַסֵּפֶר שֶׁהִיא קוֹרֵאת אָרֹךְ", wrong: ["הַסֵּפֶר שֶׁהִיא קוֹרֵא אָרֹךְ", "הַסֵּפֶר שֶׁהִיא קְרִיאָה אָרֹךְ", "הַסֵּפֶר אֶת הִיא קוֹרֵאת אָרֹךְ"] },
      { english: "you (f.) read fast", hebrew: "אַתְּ קוֹרֵאת מַהֵר", wrong: ["אַתְּ קוֹרֵא מַהֵר", "אַתְּ קְרִיאָה מַהֵר", "אַתְּ קוֹרְאוֹת מַהֵר"] },
      { english: "a book that is hard to read", hebrew: "סֵפֶר שֶׁקָּשֶׁה לִקְרֹא", wrong: ["סֵפֶר שֶׁקָּשֶׁה קוֹרֵא", "סֵפֶר שֶׁקַּל לִקְרֹא", "סֵפֶר שֶׁקָּשֶׁה קָרִיא"] },
    ],
  },
  {
    id: "root-shal", kind: "root", pattern: "paal", icon: "🌱", english: "Root ש־א־ל: ask, borrow", hebrew: "שֹׁרֶשׁ ש־א־ל: לִשְׁאֹל",
    words: [
      { english: "to ask", hebrew: "לִשְׁאֹל", wrong: ["שׁוֹאֵל", "שְׁאֵלָה", "לַעֲנוֹת"] },
      { english: "he asks", hebrew: "הוּא שׁוֹאֵל", wrong: ["הוּא שׁוֹאֶלֶת", "הוּא שׁוֹאֲלִים", "הוּא שָׁאַל"] },
      { english: "she asks", hebrew: "הִיא שׁוֹאֶלֶת", wrong: ["הִיא שׁוֹאֵל", "הִיא שׁוֹאֲלוֹת", "הִיא שָׁאֲלָה"] },
      { english: "they (m.) ask", hebrew: "הֵם שׁוֹאֲלִים", wrong: ["הֵם שׁוֹאֲלוֹת", "הֵם שׁוֹאֵל", "הֵם שָׁאֲלוּ"] },
      { english: "they (f.) ask", hebrew: "הֵן שׁוֹאֲלוֹת", wrong: ["הֵן שׁוֹאֲלִים", "הֵן שׁוֹאֶלֶת", "הֵן שָׁאֲלוּ"] },
      { english: "a question", hebrew: "שְׁאֵלָה", wrong: ["שְׁאֵלוֹן", "תְּשׁוּבָה", "שׁוֹאֵל"] },
      { english: "a questionnaire", hebrew: "שְׁאֵלוֹן", wrong: ["שְׁאֵלָה", "שְׁאֵלוֹת", "מִבְחָן"] },
      // שׁוֹאֵל + אֶת (asks someone) / עַל (about) / a question (no אֶת) / מִ (borrows FROM) / אִם (whether)
      { english: "he asks the teacher (f.)", hebrew: "הוּא שׁוֹאֵל אֶת הַמּוֹרָה", wrong: ["הוּא שׁוֹאֵל לַמּוֹרָה", "הוּא שׁוֹאֵל עִם הַמּוֹרָה", "הוּא שׁוֹאֵל מֵהַמּוֹרָה"] },
      { english: "she asks about the test", hebrew: "הִיא שׁוֹאֶלֶת עַל הַמִּבְחָן", wrong: ["הִיא שׁוֹאֶלֶת אֶת הַמִּבְחָן", "הִיא שׁוֹאֶלֶת לַמִּבְחָן", "הִיא שׁוֹאֶלֶת בַּמִּבְחָן"] },
      { english: "they (m.) ask a question", hebrew: "הֵם שׁוֹאֲלִים שְׁאֵלָה", wrong: ["הֵם שׁוֹאֲלִים אֶת שְׁאֵלָה", "הֵם שׁוֹאֲלִים לִשְׁאֵלָה", "הֵם שׁוֹאֵל שְׁאֵלָה"] },
      { english: "he borrows a pen from Dana", hebrew: "הוּא שׁוֹאֵל עֵט מִדָּנָה", wrong: ["הוּא שׁוֹאֵל עֵט לְדָנָה", "הוּא שׁוֹאֵל עֵט אֶת דָּנָה", "הוּא שׁוֹאֵל עֵט עַל דָּנָה"] },
      { english: "she asks if there is a test", hebrew: "הִיא שׁוֹאֶלֶת אִם יֵשׁ מִבְחָן", wrong: ["הִיא שׁוֹאֶלֶת עַל יֵשׁ מִבְחָן", "הִיא שׁוֹאֶלֶת אֶת יֵשׁ מִבְחָן", "הִיא שׁוֹאֵל אִם יֵשׁ מִבְחָן"] },
      // The describing word from the root (שָׁאוּל = borrowed) vs. the action (שׁוֹאֵל = asks, borrows)
      { english: "borrowed", hebrew: "שָׁאוּל", wrong: ["שׁוֹאֵל", "שְׁאֵלָה", "שְׁאוּלָה"] },
      { english: "the book is borrowed from the library", hebrew: "הַסֵּפֶר שָׁאוּל מֵהַסִּפְרִיָּה", wrong: ["הַסֵּפֶר שׁוֹאֵל מֵהַסִּפְרִיָּה", "הַסֵּפֶר שְׁאוּלָה מֵהַסִּפְרִיָּה", "הַסֵּפֶר שָׁאוּל לַסִּפְרִיָּה"] },
      // ----- More practice (2026-11-12) -----
      // The rest of the present tense
      { english: "I ask", hebrew: "אֲנִי שׁוֹאֵל", wrong: ["אֲנִי שׁוֹאֶלֶת", "אֲנִי שׁוֹאֲלִים", "אֲנִי שָׁאַלְתִּי"], f: { hebrew: "אֲנִי שׁוֹאֶלֶת", wrong: ["אֲנִי שׁוֹאֵל", "אֲנִי שׁוֹאֲלוֹת", "אֲנִי שָׁאַלְתִּי"] } },
      { english: "you (m.) ask", hebrew: "אַתָּה שׁוֹאֵל", wrong: ["אַתָּה שׁוֹאֶלֶת", "אַתָּה שׁוֹאֲלִים", "אַתָּה שָׁאַלְתָּ"] },
      { english: "you (f.) ask", hebrew: "אַתְּ שׁוֹאֶלֶת", wrong: ["אַתְּ שׁוֹאֵל", "אַתְּ שׁוֹאֲלוֹת", "אַתְּ שָׁאַלְתְּ"] },
      { english: "we ask", hebrew: "אֲנַחְנוּ שׁוֹאֲלִים", wrong: ["אֲנַחְנוּ שׁוֹאֵל", "אֲנַחְנוּ שָׁאַלְנוּ", "הֵם שׁוֹאֲלִים"], f: { hebrew: "אֲנַחְנוּ שׁוֹאֲלוֹת", wrong: ["אֲנַחְנוּ שׁוֹאֶלֶת", "אֲנַחְנוּ שָׁאַלְנוּ", "הֵן שׁוֹאֲלוֹת"] } },
      { english: "why do you (f.) ask?", hebrew: "לָמָּה אַתְּ שׁוֹאֶלֶת?", wrong: ["לָמָּה אַתְּ שׁוֹאֵל?", "לָמָּה אַתְּ שְׁאֵלָה?", "לָמָּה אַתְּ שְׁאוּלָה?"] },
      // Past and future
      { english: "he asked", hebrew: "הוּא שָׁאַל", wrong: ["הוּא שׁוֹאֵל", "הוּא יִשְׁאַל", "הִיא שָׁאֲלָה"] },
      { english: "I will ask", hebrew: "אֲנִי אֶשְׁאַל", wrong: ["אֲנִי שָׁאַלְתִּי", "אֲנִי יִשְׁאַל", "אֲנַחְנוּ נִשְׁאַל"] },
      { english: "she will ask", hebrew: "הִיא תִּשְׁאַל", wrong: ["הִיא שָׁאֲלָה", "הִיא שׁוֹאֶלֶת", "הוּא יִשְׁאַל"] },
      { english: "I asked her what time it is", hebrew: "שָׁאַלְתִּי אוֹתָהּ מָה הַשָּׁעָה", wrong: ["שָׁאַלְתִּי לָהּ מָה הַשָּׁעָה", "שָׁאַלְתִּי אוֹתוֹ מָה הַשָּׁעָה", "שָׁאַלְתִּי אוֹתָהּ אֶת מָה הַשָּׁעָה"] },
      { english: "we asked the guide (m.) about the Golan", hebrew: "שָׁאַלְנוּ אֶת הַמַּדְרִיךְ עַל הַגּוֹלָן", wrong: ["שָׁאַלְנוּ לַמַּדְרִיךְ עַל הַגּוֹלָן", "שָׁאַלְנוּ אֶת הַמַּדְרִיךְ אֶת הַגּוֹלָן", "שָׁאַלְנוּ אֶת הַמַּדְרִיךְ בַּגּוֹלָן"] },
      { english: "she borrowed my notebook", hebrew: "הִיא שָׁאֲלָה אֶת הַמַּחְבֶּרֶת שֶׁלִּי", wrong: ["הִיא שָׁאֲלָה הַמַּחְבֶּרֶת שֶׁלִּי", "הִיא שׁוֹאֶלֶת אֶת הַמַּחְבֶּרֶת שֶׁלִּי", "הִיא שָׁאֲלָה לַמַּחְבֶּרֶת שֶׁלִּי"] },
      // More nouns: שְׁאֵלָה / שְׁאֵלוֹת, שְׁאֵלוֹן / שְׁאֵלוֹנִים
      { english: "the questions", hebrew: "הַשְּׁאֵלוֹת", wrong: ["הַשְּׁאֵלָה", "הַשְּׁאֵלוֹנִים", "הַשּׁוֹאֲלוֹת"] },
      { english: "the questionnaires", hebrew: "הַשְּׁאֵלוֹנִים", wrong: ["הַשְּׁאֵלוֹן", "הַשְּׁאֵלוֹת", "הַשְּׁאֵלוֹנוֹת"] },
      { english: "a good question", hebrew: "שְׁאֵלָה טוֹבָה", wrong: ["שְׁאֵלָה טוֹב", "שְׁאֵלוֹן טוֹבָה", "טוֹבָה שְׁאֵלָה"] },
      { english: "a question mark", hebrew: "סִימַן שְׁאֵלָה", wrong: ["סִימַן קְרִיאָה", "סִימָן שְׁאֵלָה", "סִימַן שְׁאֵלוֹת"] },
      { english: "I have a question", hebrew: "יֵשׁ לִי שְׁאֵלָה", wrong: ["יֵשׁ לִי שְׁאֵלוֹן", "יֵשׁ לִי שׁוֹאֵל", "יֵשׁ אוֹתִי שְׁאֵלָה"] },
      { english: "questions about the homework", hebrew: "שְׁאֵלוֹת עַל שִׁעוּרֵי הַבַּיִת", wrong: ["שְׁאֵלוֹת אֶת שִׁעוּרֵי הַבַּיִת", "שְׁאֵלוֹת לְשִׁעוּרֵי הַבַּיִת", "שְׁאֵלוֹנִים עַל שִׁעוּרֵי הַבַּיִת"] },
      { english: "the question is hard", hebrew: "הַשְּׁאֵלָה קָשָׁה", wrong: ["הַשְּׁאֵלָה קָשֶׁה", "הַשְּׁאֵלוֹן קָשָׁה", "הַשְּׁאֵלוֹת קָשָׁה"] },
      { english: "the questions on the test are easy", hebrew: "הַשְּׁאֵלוֹת בַּמִּבְחָן קַלּוֹת", wrong: ["הַשְּׁאֵלוֹת בַּמִּבְחָן קַלִּים", "הַשְּׁאֵלוֹת בַּמִּבְחָן קַלָּה", "הַשְּׁאֵלָה בַּמִּבְחָן קַלּוֹת"] },
      { english: "the students (m.) fill out the questionnaire", hebrew: "הַתַּלְמִידִים מְמַלְּאִים אֶת הַשְּׁאֵלוֹן", wrong: ["הַתַּלְמִידִים מְמַלְּאִים הַשְּׁאֵלוֹן", "הַתַּלְמִידִים מְמַלְּאִים אֶת הַשְּׁאֵלָה", "הַתַּלְמִידִים שׁוֹאֲלִים אֶת הַשְּׁאֵלוֹן"] },
      // More describing words: שָׁאוּל, שְׁאוּלָה, שְׁאוּלִים, שְׁאוּלוֹת
      { english: "borrowed (f.)", hebrew: "שְׁאוּלָה", wrong: ["שָׁאוּל", "שְׁאוּלוֹת", "שׁוֹאֶלֶת"] },
      { english: "borrowed (m. pl.)", hebrew: "שְׁאוּלִים", wrong: ["שְׁאוּלוֹת", "שָׁאוּל", "שׁוֹאֲלִים"] },
      { english: "borrowed (f. pl.)", hebrew: "שְׁאוּלוֹת", wrong: ["שְׁאוּלִים", "שְׁאוּלָה", "שׁוֹאֲלוֹת"] },
      { english: "a borrowed pen", hebrew: "עֵט שָׁאוּל", wrong: ["עֵט שְׁאוּלָה", "שָׁאוּל עֵט", "עֵט שׁוֹאֵל"] },
      { english: "a borrowed word (a loanword)", hebrew: "מִלָּה שְׁאוּלָה", wrong: ["מִלָּה שָׁאוּל", "מִלָּה שׁוֹאֶלֶת", "מִלָּה שְׁאוּלוֹת"] },
      { english: "the shirt is borrowed from my sister", hebrew: "הַחֻלְצָה שְׁאוּלָה מֵאֲחוֹתִי", wrong: ["הַחֻלְצָה שָׁאוּל מֵאֲחוֹתִי", "הַחֻלְצָה שְׁאוּלָה לַאֲחוֹתִי", "הַחֻלְצָה שׁוֹאֶלֶת מֵאֲחוֹתִי"] },
      { english: "these books are borrowed", hebrew: "הַסְּפָרִים הָאֵלֶּה שְׁאוּלִים", wrong: ["הַסְּפָרִים הָאֵלֶּה שְׁאוּלוֹת", "הַסְּפָרִים הָאֵלֶּה שָׁאוּל", "הַסְּפָרִים הָאֵלֶּה שׁוֹאֲלִים"] },
      { english: "the shoes are borrowed", hebrew: "הַנַּעֲלַיִם שְׁאוּלוֹת", wrong: ["הַנַּעֲלַיִם שְׁאוּלִים", "הַנַּעֲלַיִם שְׁאוּלָה", "הַנַּעֲלַיִם שׁוֹאֲלוֹת"] },
      { english: "the bicycle is borrowed", hebrew: "הָאוֹפַנַּיִם שְׁאוּלִים", wrong: ["הָאוֹפַנַּיִם שָׁאוּל", "הָאוֹפַנַּיִם שְׁאוּלוֹת", "הָאוֹפַנַּיִם שׁוֹאֲלִים"] },
      // Borrow (לִשְׁאֹל מִ) vs. lend (לְהַשְׁאִיל לְ)
      { english: "I borrow a book from the library", hebrew: "אֲנִי שׁוֹאֵל סֵפֶר מֵהַסִּפְרִיָּה", wrong: ["אֲנִי שׁוֹאֵל סֵפֶר לַסִּפְרִיָּה", "אֲנִי שׁוֹאֵל סֵפֶר עַל הַסִּפְרִיָּה", "אֲנִי שׁוֹאֶלֶת סֵפֶר מֵהַסִּפְרִיָּה"], f: { hebrew: "אֲנִי שׁוֹאֶלֶת סֵפֶר מֵהַסִּפְרִיָּה", wrong: ["אֲנִי שׁוֹאֶלֶת סֵפֶר לַסִּפְרִיָּה", "אֲנִי שׁוֹאֶלֶת סֵפֶר עַל הַסִּפְרִיָּה", "אֲנִי שׁוֹאֵל סֵפֶר מֵהַסִּפְרִיָּה"] } },
      { english: "can I borrow your (m.) pen?", hebrew: "אֶפְשָׁר לִשְׁאֹל אֶת הָעֵט שֶׁלְּךָ?", wrong: ["אֶפְשָׁר לִשְׁאֹל הָעֵט שֶׁלְּךָ?", "אֶפְשָׁר לִשְׁאֹל אֶת הָעֵט שֶׁלָּךְ?", "אֶפְשָׁר לִשְׁאֹל לָעֵט שֶׁלְּךָ?"] },
      // Asking in context: שׁוֹאֵל אֶת (a person), עַל (about), אִם (whether), a question word
      { english: "can I ask a question?", hebrew: "אֶפְשָׁר לִשְׁאֹל שְׁאֵלָה?", wrong: ["אֶפְשָׁר שׁוֹאֵל שְׁאֵלָה?", "אֶפְשָׁר לִשְׁאֹל אֶת שְׁאֵלָה?", "אֶפְשָׁר לִשְׁאֹל שְׁאֵלוֹן?"] },
      { english: "she asks me", hebrew: "הִיא שׁוֹאֶלֶת אוֹתִי", wrong: ["הִיא שׁוֹאֶלֶת לִי", "הִיא שׁוֹאֶלֶת אֲנִי", "הִיא שׁוֹאֶלֶת אוֹתוֹ"] },
      { english: "the teacher (f.) asks us a question", hebrew: "הַמּוֹרָה שׁוֹאֶלֶת אוֹתָנוּ שְׁאֵלָה", wrong: ["הַמּוֹרָה שׁוֹאֶלֶת לָנוּ שְׁאֵלָה", "הַמּוֹרָה שׁוֹאֶלֶת אוֹתָנוּ אֶת שְׁאֵלָה", "הַמּוֹרָה שׁוֹאֵל אוֹתָנוּ שְׁאֵלָה"] },
      { english: "they (f.) ask about the trip", hebrew: "הֵן שׁוֹאֲלוֹת עַל הַטִּיּוּל", wrong: ["הֵן שׁוֹאֲלוֹת אֶת הַטִּיּוּל", "הֵן שׁוֹאֲלוֹת לַטִּיּוּל", "הֵן שׁוֹאֲלִים עַל הַטִּיּוּל"] },
      { english: "he asks where the bus stop is", hebrew: "הוּא שׁוֹאֵל אֵיפֹה הַתַּחֲנָה", wrong: ["הוּא שׁוֹאֵל עַל אֵיפֹה הַתַּחֲנָה", "הוּא שׁוֹאֵל אִם אֵיפֹה הַתַּחֲנָה", "הוּא שׁוֹאֶלֶת אֵיפֹה הַתַּחֲנָה"] },
      { english: "he asks his friend if he wants to come", hebrew: "הוּא שׁוֹאֵל אֶת הֶחָבֵר שֶׁלּוֹ אִם הוּא רוֹצֶה לָבוֹא", wrong: ["הוּא שׁוֹאֵל לֶחָבֵר שֶׁלּוֹ אִם הוּא רוֹצֶה לָבוֹא", "הוּא שׁוֹאֵל אֶת הֶחָבֵר שֶׁלּוֹ שֶׁהוּא רוֹצֶה לָבוֹא", "הוּא שׁוֹאֵל אֶת הֶחָבֵר שֶׁלּוֹ אִם הוּא רוֹצֶה בָּא"] },
      { english: "you (m.) ask too many questions", hebrew: "אַתָּה שׁוֹאֵל יוֹתֵר מִדַּי שְׁאֵלוֹת", wrong: ["אַתָּה שׁוֹאֵל יוֹתֵר מִדַּי שְׁאֵלוֹנִים", "אַתָּה שׁוֹאֶלֶת יוֹתֵר מִדַּי שְׁאֵלוֹת", "אַתָּה שׁוֹאֵל יוֹתֵר מִדַּי אֶת שְׁאֵלוֹת"] },
    ],
  },
  {
    id: "root-shma", kind: "root", pattern: "paal", icon: "🌱", english: "Root ש־מ־ע: hear", hebrew: "שֹׁרֶשׁ ש־מ־ע: לִשְׁמֹעַ",
    words: [
      { english: "to hear", hebrew: "לִשְׁמֹעַ", wrong: ["שׁוֹמֵעַ", "שְׁמוּעָה", "לְדַבֵּר"] },
      { english: "he hears", hebrew: "הוּא שׁוֹמֵעַ", wrong: ["הוּא שׁוֹמַעַת", "הוּא שׁוֹמְעִים", "הוּא שָׁמַע"] },
      { english: "she hears", hebrew: "הִיא שׁוֹמַעַת", wrong: ["הִיא שׁוֹמֵעַ", "הִיא שׁוֹמְעוֹת", "הִיא שָׁמְעָה"] },
      { english: "they (m.) hear", hebrew: "הֵם שׁוֹמְעִים", wrong: ["הֵם שׁוֹמְעוֹת", "הֵם שׁוֹמֵעַ", "הֵם שָׁמְעוּ"] },
      { english: "they (f.) hear", hebrew: "הֵן שׁוֹמְעוֹת", wrong: ["הֵן שׁוֹמְעִים", "הֵן שׁוֹמַעַת", "הֵן שָׁמְעוּ"] },
      { english: "a rumor", hebrew: "שְׁמוּעָה", wrong: ["שְׁאֵלָה", "שׁוֹמֵעַ", "סִפּוּר"] },
      { english: "what's up? (how's it going?)", hebrew: "מָה נִשְׁמָע?", wrong: ["מָה שׁוֹמֵעַ?", "מָה שָׁמַע?", "אֵיפֹה נִשְׁמָע?"] },
      // שׁוֹמֵעַ + אֶת (hears something) / עַל (hears about) / מִ (hears from) / לְ (listens to = obeys)
      { english: "she hears the music", hebrew: "הִיא שׁוֹמַעַת אֶת הַמּוּזִיקָה", wrong: ["הִיא שׁוֹמַעַת הַמּוּזִיקָה", "הִיא שׁוֹמַעַת לַמּוּזִיקָה", "הִיא שׁוֹמֵעַ אֶת הַמּוּזִיקָה"] },
      { english: "he hears about the trip", hebrew: "הוּא שׁוֹמֵעַ עַל הַטִּיּוּל", wrong: ["הוּא שׁוֹמֵעַ אֶת הַטִּיּוּל", "הוּא שׁוֹמֵעַ לַטִּיּוּל", "הוּא שׁוֹמֵעַ בַּטִּיּוּל"] },
      { english: "they (m.) hear from Dana", hebrew: "הֵם שׁוֹמְעִים מִדָּנָה", wrong: ["הֵם שׁוֹמְעִים לְדָנָה", "הֵם שׁוֹמְעִים אֶת דָּנָה", "הֵם שׁוֹמֵעַ מִדָּנָה"] },
      { english: "the children obey the teacher (f.) (listen to her)", hebrew: "הַיְּלָדִים שׁוֹמְעִים לַמּוֹרָה", wrong: ["הַיְּלָדִים שׁוֹמְעִים אֶת הַמּוֹרָה", "הַיְּלָדִים שׁוֹמְעִים עַל הַמּוֹרָה", "הַיְּלָדִים שׁוֹמֵעַ לַמּוֹרָה"] },
      // A describing form from the root (נִשְׁמָע = sounds) vs. the action (שׁוֹמֵעַ = hears)
      { english: "that sounds good", hebrew: "זֶה נִשְׁמָע טוֹב", wrong: ["זֶה שׁוֹמֵעַ טוֹב", "זֶה נִשְׁמַעַת טוֹב", "זֶה שָׁמַע טוֹב"] },
      { english: "the music sounds great", hebrew: "הַמּוּזִיקָה נִשְׁמַעַת נֶהְדָּר", wrong: ["הַמּוּזִיקָה שׁוֹמַעַת נֶהְדָּר", "הַמּוּזִיקָה נִשְׁמָע נֶהְדָּר", "הַמּוּזִיקָה שָׁמְעָה נֶהְדָּר"] },
      // ----- More practice (2026-11-12) -----
      // More present tense: I, you, we
      { english: "I hear", hebrew: "אֲנִי שׁוֹמֵעַ", wrong: ["אֲנִי שׁוֹמְעִים", "אֲנִי שָׁמַעְתִּי", "אֲנִי נִשְׁמָע"], f: { hebrew: "אֲנִי שׁוֹמַעַת", wrong: ["אֲנִי שׁוֹמְעוֹת", "אֲנִי שָׁמַעְתִּי", "אֲנִי נִשְׁמַעַת"] } },
      { english: "you (m.) hear", hebrew: "אַתָּה שׁוֹמֵעַ", wrong: ["אַתָּה שׁוֹמַעַת", "אַתָּה שׁוֹמְעִים", "אַתָּה שָׁמַעְתָּ"] },
      { english: "you (f.) hear", hebrew: "אַתְּ שׁוֹמַעַת", wrong: ["אַתְּ שׁוֹמֵעַ", "אַתְּ שׁוֹמְעוֹת", "אַתְּ שָׁמַעַתְּ"] },
      { english: "we hear", hebrew: "אֲנַחְנוּ שׁוֹמְעִים", wrong: ["אֲנַחְנוּ שׁוֹמֵעַ", "אֲנַחְנוּ שָׁמַעְנוּ", "אֲנַחְנוּ נִשְׁמָעִים"], f: { hebrew: "אֲנַחְנוּ שׁוֹמְעוֹת", wrong: ["אֲנַחְנוּ שׁוֹמַעַת", "אֲנַחְנוּ שָׁמַעְנוּ", "אֲנַחְנוּ נִשְׁמָעוֹת"] } },
      // Past, future, and "listen!"
      { english: "I heard", hebrew: "שָׁמַעְתִּי", wrong: ["שָׁמַעְתָּ", "שָׁמַעְנוּ", "אֶשְׁמַע"] },
      { english: "he heard", hebrew: "הוּא שָׁמַע", wrong: ["הוּא שָׁמְעָה", "הוּא שׁוֹמֵעַ", "הוּא יִשְׁמַע"] },
      { english: "she heard", hebrew: "הִיא שָׁמְעָה", wrong: ["הִיא שָׁמַע", "הִיא שׁוֹמַעַת", "הִיא תִּשְׁמַע"] },
      { english: "we heard the news", hebrew: "שָׁמַעְנוּ אֶת הַחֲדָשׁוֹת", wrong: ["שָׁמַעְנוּ הַחֲדָשׁוֹת", "שָׁמַעְנוּ לַחֲדָשׁוֹת", "נִשְׁמַע אֶת הַחֲדָשׁוֹת"] },
      { english: "they (m.) heard a noise", hebrew: "הֵם שָׁמְעוּ רַעַשׁ", wrong: ["הֵם שָׁמְעוּ אֶת רַעַשׁ", "הֵם שׁוֹמְעִים רַעַשׁ", "הֵם שָׁמַע רַעַשׁ"] },
      { english: "I will hear", hebrew: "אֶשְׁמַע", wrong: ["נִשְׁמַע", "שָׁמַעְתִּי", "תִּשְׁמַע"] },
      { english: "tomorrow we will hear the results", hebrew: "מָחָר נִשְׁמַע אֶת הַתּוֹצָאוֹת", wrong: ["מָחָר שָׁמַעְנוּ אֶת הַתּוֹצָאוֹת", "מָחָר נִשְׁמַע הַתּוֹצָאוֹת", "מָחָר אֶשְׁמַע אֶת הַתּוֹצָאוֹת"] },
      { english: "listen! (to a boy)", hebrew: "שְׁמַע!", wrong: ["שִׁמְעִי!", "שׁוֹמֵעַ!", "שָׁמַע!"] },
      { english: "listen! (to a girl)", hebrew: "שִׁמְעִי!", wrong: ["שְׁמַע!", "שׁוֹמַעַת!", "שָׁמְעָה!"] },
      // Describing word נִשְׁמָע (sounds): m., f., m. plural, f. plural
      { english: "sounds (m.)", hebrew: "נִשְׁמָע", wrong: ["נִשְׁמַעַת", "שׁוֹמֵעַ", "נִשְׁמָעִים"] },
      { english: "sounds (f.)", hebrew: "נִשְׁמַעַת", wrong: ["נִשְׁמָע", "שׁוֹמַעַת", "נִשְׁמָעוֹת"] },
      { english: "sound (m. plural)", hebrew: "נִשְׁמָעִים", wrong: ["נִשְׁמָעוֹת", "שׁוֹמְעִים", "נִשְׁמָע"] },
      { english: "sound (f. plural)", hebrew: "נִשְׁמָעוֹת", wrong: ["נִשְׁמָעִים", "שׁוֹמְעוֹת", "נִשְׁמַעַת"] },
      { english: "the songs sound good", hebrew: "הַשִּׁירִים נִשְׁמָעִים טוֹב", wrong: ["הַשִּׁירִים שׁוֹמְעִים טוֹב", "הַשִּׁירִים נִשְׁמָע טוֹב", "הַשִּׁירִים נִשְׁמָעוֹת טוֹב"] },
      { english: "the girls sound tired", hebrew: "הַבָּנוֹת נִשְׁמָעוֹת עֲיֵפוֹת", wrong: ["הַבָּנוֹת שׁוֹמְעוֹת עֲיֵפוֹת", "הַבָּנוֹת נִשְׁמָעִים עֲיֵפוֹת", "הַבָּנוֹת נִשְׁמָעוֹת עֲיֵפִים"] },
      { english: "the idea sounds interesting", hebrew: "הָרַעְיוֹן נִשְׁמָע מְעַנְיֵן", wrong: ["הָרַעְיוֹן נִשְׁמַעַת מְעַנְיֵן", "הָרַעְיוֹן שׁוֹמֵעַ מְעַנְיֵן", "הָרַעְיוֹן נִשְׁמָע מְעַנְיֶנֶת"] },
      { english: "the teacher (f.) sounds angry", hebrew: "הַמּוֹרָה נִשְׁמַעַת כּוֹעֶסֶת", wrong: ["הַמּוֹרָה נִשְׁמָע כּוֹעֶסֶת", "הַמּוֹרָה שׁוֹמַעַת כּוֹעֶסֶת", "הַמּוֹרָה נִשְׁמַעַת כּוֹעֵס"] },
      { english: "you (m.) sound tired", hebrew: "אַתָּה נִשְׁמָע עָיֵף", wrong: ["אַתָּה שׁוֹמֵעַ עָיֵף", "אַתָּה נִשְׁמַעַת עָיֵף", "אַתָּה נִשְׁמָע עֲיֵפָה"] },
      { english: "the news sounds good", hebrew: "הַחֲדָשׁוֹת נִשְׁמָעוֹת טוֹב", wrong: ["הַחֲדָשׁוֹת נִשְׁמָעִים טוֹב", "הַחֲדָשׁוֹת שׁוֹמְעוֹת טוֹב", "הַחֲדָשׁוֹת נִשְׁמַעַת טוֹב"] },
      // Describing word מַשְׁמָעוּתִי (meaningful)
      { english: "meaningful (m.)", hebrew: "מַשְׁמָעוּתִי", wrong: ["מַשְׁמָעוּתִית", "מַשְׁמָעוּת", "נִשְׁמָע"] },
      { english: "a meaningful trip", hebrew: "טִיּוּל מַשְׁמָעוּתִי", wrong: ["טִיּוּל מַשְׁמָעוּתִית", "טִיּוּל מַשְׁמָעוּת", "הַטִּיּוּל מַשְׁמָעוּתִי"] },
      { english: "a meaningful conversation", hebrew: "שִׂיחָה מַשְׁמָעוּתִית", wrong: ["שִׂיחָה מַשְׁמָעוּתִי", "שִׂיחָה מַשְׁמָעוּתִיּוֹת", "שִׂיחָה מִשְׁמַעַת"] },
      // Nouns from the root: מַשְׁמָעוּת (meaning), מִשְׁמַעַת (discipline), שְׁמוּעוֹת (rumors)
      { english: "meaning", hebrew: "מַשְׁמָעוּת", wrong: ["מִשְׁמַעַת", "שְׁמוּעָה", "מַשְׁמָעוּתִי"] },
      { english: "discipline", hebrew: "מִשְׁמַעַת", wrong: ["מַשְׁמָעוּת", "שְׁמוּעָה", "נִשְׁמַעַת"] },
      { english: "the rumors", hebrew: "הַשְּׁמוּעוֹת", wrong: ["הַשְּׁמוּעָה", "הַשְּׁמוּעִים", "הַשְּׁאֵלוֹת"] },
      { english: "the rumor isn't true", hebrew: "הַשְּׁמוּעָה לֹא נְכוֹנָה", wrong: ["הַשְּׁמוּעָה לֹא נָכוֹן", "הַשְּׁמוּעוֹת לֹא נְכוֹנָה", "הַשּׁוֹמַעַת לֹא נְכוֹנָה"] },
      { english: "everyone hears the rumors", hebrew: "כֻּלָּם שׁוֹמְעִים אֶת הַשְּׁמוּעוֹת", wrong: ["כֻּלָּם שׁוֹמְעִים הַשְּׁמוּעוֹת", "כֻּלָּם שׁוֹמְעִים לַשְּׁמוּעוֹת", "כֻּלָּם נִשְׁמָעִים אֶת הַשְּׁמוּעוֹת"] },
      { english: "what's the meaning of this word?", hebrew: "מָה הַמַּשְׁמָעוּת שֶׁל הַמִּלָּה הַזֹּאת?", wrong: ["מָה הַמִּשְׁמַעַת שֶׁל הַמִּלָּה הַזֹּאת?", "מָה הַשְּׁמוּעָה שֶׁל הַמִּלָּה הַזֹּאת?", "מָה הַמַּשְׁמָעוּת שֶׁל הַמִּלָּה הַזֶּה?"] },
      { english: "there's a lot of discipline in the class", hebrew: "בַּכִּתָּה יֵשׁ הַרְבֵּה מִשְׁמַעַת", wrong: ["בַּכִּתָּה יֵשׁ הַרְבֵּה מַשְׁמָעוּת", "בַּכִּתָּה יֵשׁ הַרְבֵּה שְׁמוּעוֹת", "בַּכִּתָּה יֵשׁ הַרְבֵּה נִשְׁמַעַת"] },
      // Everyday sentences: שׁוֹמֵעַ + אֶת / אוֹתִי / עַל / מִ / בְּקוֹל
      { english: "I hear you (m.)", hebrew: "אֲנִי שׁוֹמֵעַ אוֹתְךָ", wrong: ["אֲנִי שׁוֹמֵעַ אוֹתוֹ", "אֲנִי שׁוֹמֵעַ אוֹתָךְ", "אֲנִי שׁוֹמֵעַ מִמְּךָ"], f: { hebrew: "אֲנִי שׁוֹמַעַת אוֹתְךָ", wrong: ["אֲנִי שׁוֹמַעַת אוֹתוֹ", "אֲנִי שׁוֹמַעַת אוֹתָךְ", "אֲנִי שׁוֹמַעַת מִמְּךָ"] } },
      { english: "do you (m.) hear me?", hebrew: "אַתָּה שׁוֹמֵעַ אוֹתִי?", wrong: ["אַתָּה שׁוֹמֵעַ לִי?", "אַתָּה שׁוֹמֵעַ אֶת אֲנִי?", "אַתָּה שׁוֹמַעַת אוֹתִי?"] },
      { english: "I heard about the party", hebrew: "שָׁמַעְתִּי עַל הַמְּסִבָּה", wrong: ["שָׁמַעְתִּי אֶת הַמְּסִבָּה", "שָׁמַעְתִּי לַמְּסִבָּה", "שָׁמַעְתִּי מֵהַמְּסִבָּה"] },
      { english: "we heard from Yossi that there's a test", hebrew: "שָׁמַעְנוּ מִיּוֹסִי שֶׁיֵּשׁ מִבְחָן", wrong: ["שָׁמַעְנוּ לְיוֹסִי שֶׁיֵּשׁ מִבְחָן", "שָׁמַעְנוּ אֶת יוֹסִי שֶׁיֵּשׁ מִבְחָן", "שָׁמַעְנוּ עַל יוֹסִי שֶׁיֵּשׁ מִבְחָן"] },
      { english: "he obeys his parents", hebrew: "הוּא שׁוֹמֵעַ בְּקוֹל הַהוֹרִים שֶׁלּוֹ", wrong: ["הוּא שׁוֹמֵעַ אֶת קוֹל הַהוֹרִים שֶׁלּוֹ", "הוּא שׁוֹמֵעַ עַל קוֹל הַהוֹרִים שֶׁלּוֹ", "הוּא נִשְׁמָע בְּקוֹל הַהוֹרִים שֶׁלּוֹ"] },
      { english: "we listen to music every evening", hebrew: "אֲנַחְנוּ שׁוֹמְעִים מוּזִיקָה כָּל עֶרֶב", wrong: ["אֲנַחְנוּ שׁוֹמְעִים לְמוּזִיקָה כָּל עֶרֶב", "אֲנַחְנוּ שׁוֹמֵעַ מוּזִיקָה כָּל עֶרֶב", "אֲנַחְנוּ נִשְׁמָעִים מוּזִיקָה כָּל עֶרֶב"], f: { hebrew: "אֲנַחְנוּ שׁוֹמְעוֹת מוּזִיקָה כָּל עֶרֶב", wrong: ["אֲנַחְנוּ שׁוֹמְעוֹת לְמוּזִיקָה כָּל עֶרֶב", "אֲנַחְנוּ שׁוֹמַעַת מוּזִיקָה כָּל עֶרֶב", "אֲנַחְנוּ נִשְׁמָעוֹת מוּזִיקָה כָּל עֶרֶב"] } },
      { english: "the students hear the bell", hebrew: "הַתַּלְמִידִים שׁוֹמְעִים אֶת הַצִּלְצוּל", wrong: ["הַתַּלְמִידִים שׁוֹמְעִים הַצִּלְצוּל", "הַתַּלְמִידִים שׁוֹמְעִים לַצִּלְצוּל", "הַתַּלְמִידִים שׁוֹמֵעַ אֶת הַצִּלְצוּל"] },
      { english: "I don't hear anything", hebrew: "אֲנִי לֹא שׁוֹמֵעַ כְּלוּם", wrong: ["אֲנִי לֹא שׁוֹמֵעַ אֶת כְּלוּם", "אֲנִי לֹא נִשְׁמָע כְּלוּם", "אֲנִי לֹא שָׁמַעְתִּי כְּלוּם"], f: { hebrew: "אֲנִי לֹא שׁוֹמַעַת כְּלוּם", wrong: ["אֲנִי לֹא שׁוֹמַעַת אֶת כְּלוּם", "אֲנִי לֹא נִשְׁמַעַת כְּלוּם", "אֲנִי לֹא שָׁמַעְתִּי כְּלוּם"] } },
      { english: "Grandma doesn't hear well", hebrew: "סַבְתָּא לֹא שׁוֹמַעַת טוֹב", wrong: ["סַבְתָּא לֹא שׁוֹמֵעַ טוֹב", "סַבְתָּא לֹא נִשְׁמַעַת טוֹב", "סַבְתָּא לֹא שׁוֹמְעוֹת טוֹב"] },
      { english: "did you (f.) hear what happened?", hebrew: "שָׁמַעַתְּ מָה קָרָה?", wrong: ["שָׁמַעְתָּ מָה קָרָה?", "שָׁמַעַתְּ אֶת מָה קָרָה?", "תִּשְׁמְעִי מָה קָרָה?"] },
      { english: "what's new with you (m.)?", hebrew: "מָה נִשְׁמָע אִתְּךָ?", wrong: ["מָה שׁוֹמֵעַ אִתְּךָ?", "מָה נִשְׁמַעַת אִתְּךָ?", "מָה נִשְׁמָע לְךָ?"] },
    ],
  },
  {
    id: "root-rah", kind: "root", pattern: "paal", icon: "🌱", english: "Root ר־א־ה: see, look", hebrew: "שֹׁרֶשׁ ר־א־ה: לִרְאוֹת",
    words: [
      { english: "to see", hebrew: "לִרְאוֹת", wrong: ["רוֹאֶה", "מַרְאָה", "לִשְׁמֹעַ"] },
      { english: "he sees", hebrew: "הוּא רוֹאֶה", wrong: ["הוּא רוֹאָה", "הוּא רוֹאִים", "הוּא רָאָה"] },
      { english: "she sees", hebrew: "הִיא רוֹאָה", wrong: ["הִיא רוֹאֶה", "הִיא רוֹאוֹת", "הִיא רָאֲתָה"] },
      { english: "they (m.) see", hebrew: "הֵם רוֹאִים", wrong: ["הֵם רוֹאוֹת", "הֵם רוֹאֶה", "הֵם רָאוּ"] },
      { english: "they (f.) see", hebrew: "הֵן רוֹאוֹת", wrong: ["הֵן רוֹאִים", "הֵן רוֹאָה", "הֵן רָאוּ"] },
      { english: "a mirror", hebrew: "מַרְאָה", wrong: ["מַרְאֶה", "רוֹאָה", "חַלּוֹן"] },
      // רוֹאֶה + אֶת (sees THE …) / nothing (sees A …) / בְּ (on TV) / נִרְאֶה = looks, seems
      { english: "she sees the sea", hebrew: "הִיא רוֹאָה אֶת הַיָּם", wrong: ["הִיא רוֹאָה הַיָּם", "הִיא רוֹאָה לַיָּם", "הִיא רוֹאֶה אֶת הַיָּם"] },
      { english: "he watches a movie", hebrew: "הוּא רוֹאֶה סֶרֶט", wrong: ["הוּא רוֹאֶה אֶת סֶרֶט", "הוּא רוֹאֶה בְּסֶרֶט", "הוּא רוֹאָה סֶרֶט"] },
      { english: "they (m.) watch the game on TV", hebrew: "הֵם רוֹאִים אֶת הַמִּשְׂחָק בַּטֵּלֶוִיזְיָה", wrong: ["הֵם רוֹאִים אֶת הַמִּשְׂחָק לַטֵּלֶוִיזְיָה", "הֵם רוֹאִים אֶת הַמִּשְׂחָק עַל הַטֵּלֶוִיזְיָה", "הֵם רוֹאִים הַמִּשְׂחָק בַּטֵּלֶוִיזְיָה"] },
      { english: "he looks tired", hebrew: "הוּא נִרְאֶה עָיֵף", wrong: ["הוּא רוֹאֶה עָיֵף", "הוּא נִרְאֵית עָיֵף", "הוּא נִרְאֶה עֲיֵפָה"] },
      { english: "she looks happy", hebrew: "הִיא נִרְאֵית שְׂמֵחָה", wrong: ["הִיא רוֹאָה שְׂמֵחָה", "הִיא נִרְאֶה שְׂמֵחָה", "הִיא נִרְאֵית שָׂמֵחַ"] },
      // Describing words from the root: נִרְאֶה = looks, seems; רָאוּי = proper, worthy. vs. the action (רוֹאֶה = sees)
      { english: "proper, worthy (m.)", hebrew: "רָאוּי", wrong: ["רוֹאֶה", "רְאוּיָה", "מַרְאֶה"] },
      { english: "you (m.) look tired", hebrew: "אַתָּה נִרְאֶה עָיֵף", wrong: ["אַתָּה רוֹאֶה עָיֵף", "אַתָּה נִרְאֵית עָיֵף", "אַתָּה רָאִיתָ עָיֵף"] },
      // ----- More practice (2026-11-12) -----
      // More present tense: I, you, we
      { english: "I see", hebrew: "אֲנִי רוֹאֶה", wrong: ["אֲנִי רוֹאִים", "אֲנִי רָאִיתִי", "אֲנִי נִרְאֶה"], f: { hebrew: "אֲנִי רוֹאָה", wrong: ["אֲנִי רוֹאוֹת", "אֲנִי רָאִיתִי", "אֲנִי נִרְאֵית"] } },
      { english: "you (m.) see", hebrew: "אַתָּה רוֹאֶה", wrong: ["אַתָּה רוֹאָה", "אַתָּה רוֹאִים", "אַתָּה רָאִיתָ"] },
      { english: "you (f.) see", hebrew: "אַתְּ רוֹאָה", wrong: ["אַתְּ רוֹאֶה", "אַתְּ רוֹאוֹת", "אַתְּ רָאִית"] },
      { english: "we see", hebrew: "אֲנַחְנוּ רוֹאִים", wrong: ["אֲנַחְנוּ רוֹאֶה", "אֲנַחְנוּ רָאִינוּ", "אֲנַחְנוּ נִרְאִים"], f: { hebrew: "אֲנַחְנוּ רוֹאוֹת", wrong: ["אֲנַחְנוּ רוֹאָה", "אֲנַחְנוּ רָאִינוּ", "אֲנַחְנוּ נִרְאוֹת"] } },
      // Past and future
      { english: "I saw", hebrew: "רָאִיתִי", wrong: ["רָאִינוּ", "רָאִיתָ", "אֶרְאֶה"] },
      { english: "he saw", hebrew: "הוּא רָאָה", wrong: ["הוּא רָאֲתָה", "הוּא רוֹאֶה", "הוּא יִרְאֶה"] },
      { english: "she saw", hebrew: "הִיא רָאֲתָה", wrong: ["הִיא רָאָה", "הִיא רוֹאָה", "הִיא תִּרְאֶה"] },
      { english: "yesterday we saw a good movie", hebrew: "אֶתְמוֹל רָאִינוּ סֶרֶט טוֹב", wrong: ["אֶתְמוֹל רָאִינוּ אֶת סֶרֶט טוֹב", "אֶתְמוֹל נִרְאֶה סֶרֶט טוֹב", "אֶתְמוֹל רָאִינוּ בְּסֶרֶט טוֹב"] },
      { english: "they (m.) saw us", hebrew: "הֵם רָאוּ אוֹתָנוּ", wrong: ["הֵם רָאוּ לָנוּ", "הֵם רָאוּ אֶת אֲנַחְנוּ", "הֵם רוֹאִים אוֹתָנוּ"] },
      { english: "I will see you (m.) tomorrow", hebrew: "אֶרְאֶה אוֹתְךָ מָחָר", wrong: ["רָאִיתִי אוֹתְךָ מָחָר", "אֶרְאֶה לְךָ מָחָר", "נִרְאֶה אוֹתְךָ מָחָר"] },
      { english: "it seems that it will rain", hebrew: "נִרְאֶה שֶׁיֵּרֵד גֶּשֶׁם", wrong: ["רוֹאֶה שֶׁיֵּרֵד גֶּשֶׁם", "נִרְאֵית שֶׁיֵּרֵד גֶּשֶׁם", "נִרְאֶה שֶׁיָּרַד גֶּשֶׁם"] },
      // Describing word נִרְאֶה (looks, seems): m., f., m. plural, f. plural
      { english: "looks, seems (m.)", hebrew: "נִרְאֶה", wrong: ["נִרְאֵית", "רוֹאֶה", "נִרְאִים"] },
      { english: "looks, seems (f.)", hebrew: "נִרְאֵית", wrong: ["נִרְאֶה", "רוֹאָה", "נִרְאוֹת"] },
      { english: "look, seem (m. plural)", hebrew: "נִרְאִים", wrong: ["נִרְאוֹת", "רוֹאִים", "נִרְאֶה"] },
      { english: "look, seem (f. plural)", hebrew: "נִרְאוֹת", wrong: ["נִרְאִים", "רוֹאוֹת", "נִרְאֵית"] },
      { english: "the kids look happy", hebrew: "הַיְּלָדִים נִרְאִים שְׂמֵחִים", wrong: ["הַיְּלָדִים רוֹאִים שְׂמֵחִים", "הַיְּלָדִים נִרְאוֹת שְׂמֵחִים", "הַיְּלָדִים נִרְאִים שָׂמֵחַ"] },
      { english: "the girls look tired", hebrew: "הַבָּנוֹת נִרְאוֹת עֲיֵפוֹת", wrong: ["הַבָּנוֹת רוֹאוֹת עֲיֵפוֹת", "הַבָּנוֹת נִרְאִים עֲיֵפוֹת", "הַבָּנוֹת נִרְאוֹת עֲיֵפִים"] },
      { english: "the shirt looks new", hebrew: "הַחֻלְצָה נִרְאֵית חֲדָשָׁה", wrong: ["הַחֻלְצָה נִרְאֶה חֲדָשָׁה", "הַחֻלְצָה רוֹאָה חֲדָשָׁה", "הַחֻלְצָה נִרְאֵית חָדָשׁ"] },
      { english: "you (f.) look great", hebrew: "אַתְּ נִרְאֵית מְצֻיָּן", wrong: ["אַתְּ נִרְאֶה מְצֻיָּן", "אַתְּ רוֹאָה מְצֻיָּן", "אַתְּ נִרְאוֹת מְצֻיָּן"] },
      { english: "it doesn't look good", hebrew: "זֶה לֹא נִרְאֶה טוֹב", wrong: ["זֶה לֹא רוֹאֶה טוֹב", "זֶה לֹא נִרְאֵית טוֹב", "זֶה לֹא נִרְאִים טוֹב"] },
      { english: "the cookies look tasty", hebrew: "הָעוּגִיּוֹת נִרְאוֹת טְעִימוֹת", wrong: ["הָעוּגִיּוֹת נִרְאִים טְעִימוֹת", "הָעוּגִיּוֹת רוֹאוֹת טְעִימוֹת", "הָעוּגִיּוֹת נִרְאוֹת טָעִים"] },
      // Describing word רָאוּי (proper, worthy): f., m. plural, f. plural
      { english: "proper, worthy (f.)", hebrew: "רְאוּיָה", wrong: ["רָאוּי", "רוֹאָה", "רְאוּיוֹת"] },
      { english: "proper, worthy (m. plural)", hebrew: "רְאוּיִים", wrong: ["רְאוּיוֹת", "רוֹאִים", "רָאוּי"] },
      { english: "proper, worthy (f. plural)", hebrew: "רְאוּיוֹת", wrong: ["רְאוּיִים", "רוֹאוֹת", "רְאוּיָה"] },
      { english: "he is worthy of the prize", hebrew: "הוּא רָאוּי לַפְּרָס", wrong: ["הוּא רוֹאֶה לַפְּרָס", "הוּא רְאוּיָה לַפְּרָס", "הוּא רָאוּי אֶת הַפְּרָס"] },
      { english: "she is worthy of a good grade", hebrew: "הִיא רְאוּיָה לְצִיּוּן טוֹב", wrong: ["הִיא רָאוּי לְצִיּוּן טוֹב", "הִיא רוֹאָה צִיּוּן טוֹב", "הִיא רְאוּיָה אֶת צִיּוּן טוֹב"] },
      { english: "this is not proper behavior", hebrew: "זוֹ לֹא הִתְנַהֲגוּת רְאוּיָה", wrong: ["זוֹ לֹא הִתְנַהֲגוּת רָאוּי", "זוֹ לֹא הִתְנַהֲגוּת רוֹאָה", "זוֹ לֹא הִתְנַהֲגוּת רְאוּיוֹת"] },
      { english: "the players are worthy of the cup", hebrew: "הַשַּׂחְקָנִים רְאוּיִים לַגָּבִיעַ", wrong: ["הַשַּׂחְקָנִים רָאוּי לַגָּבִיעַ", "הַשַּׂחְקָנִים רוֹאִים לַגָּבִיעַ", "הַשַּׂחְקָנִים רְאוּיוֹת לַגָּבִיעַ"] },
      // Nouns from the root: מַרְאֶה (view, look), מַרְאָה (mirror), רְאִיָּה (eyesight), רֵאָיוֹן (interview)
      { english: "appearance, view", hebrew: "מַרְאֶה", wrong: ["מַרְאָה", "רְאִיָּה", "רוֹאֶה"] },
      { english: "she sees herself in the mirror", hebrew: "הִיא רוֹאָה אֶת עַצְמָהּ בַּמַּרְאָה", wrong: ["הִיא רוֹאָה אֶת עַצְמָהּ בַּמַּרְאֶה", "הִיא רוֹאָה אֶת עַצְמָהּ לַמַּרְאָה", "הִיא רוֹאָה אֶת עַצְמוֹ בַּמַּרְאָה"] },
      { english: "what a beautiful view!", hebrew: "אֵיזֶה מַרְאֶה יָפֶה!", wrong: ["אֵיזֶה מַרְאָה יָפֶה!", "אֵיזוֹ מַרְאֶה יָפָה!", "אֵיזֶה רְאִיָּה יָפֶה!"] },
      { english: "eyesight", hebrew: "רְאִיָּה", wrong: ["רֵאָיוֹן", "מַרְאֶה", "רְאוּיָה"] },
      { english: "Grandpa has good eyesight", hebrew: "לְסַבָּא יֵשׁ רְאִיָּה טוֹבָה", wrong: ["לְסַבָּא יֵשׁ רְאִיָּה טוֹב", "לְסַבָּא יֵשׁ מַרְאֶה טוֹבָה", "סַבָּא יֵשׁ רְאִיָּה טוֹבָה"] },
      { english: "an interview", hebrew: "רֵאָיוֹן", wrong: ["רְאִיָּה", "רֵאָיוֹנוֹת", "מַרְאֶה"] },
      { english: "the interviews", hebrew: "הָרֵאָיוֹנוֹת", wrong: ["הָרֵאָיוֹן", "הָרֵאָיוֹנִים", "הָרְאִיּוֹת"] },
      // Everyday sentences: רוֹאֶה + אֶת / אוֹתְךָ / שֶׁ
      { english: "I don't see the board", hebrew: "אֲנִי לֹא רוֹאֶה אֶת הַלּוּחַ", wrong: ["אֲנִי לֹא רוֹאֶה הַלּוּחַ", "אֲנִי לֹא נִרְאֶה אֶת הַלּוּחַ", "אֲנִי לֹא רוֹאֶה בַּלּוּחַ"], f: { hebrew: "אֲנִי לֹא רוֹאָה אֶת הַלּוּחַ", wrong: ["אֲנִי לֹא רוֹאָה הַלּוּחַ", "אֲנִי לֹא נִרְאֵית אֶת הַלּוּחַ", "אֲנִי לֹא רוֹאָה בַּלּוּחַ"] } },
      { english: "in the evening we watch TV", hebrew: "בָּעֶרֶב אֲנַחְנוּ רוֹאִים טֵלֶוִיזְיָה", wrong: ["בָּעֶרֶב אֲנַחְנוּ רוֹאֶה טֵלֶוִיזְיָה", "בָּעֶרֶב אֲנַחְנוּ נִרְאִים טֵלֶוִיזְיָה", "בָּעֶרֶב רָאִינוּ טֵלֶוִיזְיָה"], f: { hebrew: "בָּעֶרֶב אֲנַחְנוּ רוֹאוֹת טֵלֶוִיזְיָה", wrong: ["בָּעֶרֶב אֲנַחְנוּ רוֹאָה טֵלֶוִיזְיָה", "בָּעֶרֶב אֲנַחְנוּ נִרְאוֹת טֵלֶוִיזְיָה", "בָּעֶרֶב רָאִינוּ טֵלֶוִיזְיָה"] } },
      { english: "do you (m.) see the bus?", hebrew: "אַתָּה רוֹאֶה אֶת הָאוֹטוֹבּוּס?", wrong: ["אַתָּה רוֹאֶה הָאוֹטוֹבּוּס?", "אַתָּה נִרְאֶה אֶת הָאוֹטוֹבּוּס?", "אַתְּ רוֹאָה אֶת הָאוֹטוֹבּוּס?"] },
      { english: "I'm glad to see you (m.)", hebrew: "אֲנִי שָׂמֵחַ לִרְאוֹת אוֹתְךָ", wrong: ["אֲנִי שָׂמֵחַ לִרְאוֹת לְךָ", "אֲנִי שָׂמֵחַ רוֹאֶה אוֹתְךָ", "אֲנִי שָׂמֵחַ לְהֵרָאוֹת אוֹתְךָ"], f: { hebrew: "אֲנִי שְׂמֵחָה לִרְאוֹת אוֹתְךָ", wrong: ["אֲנִי שְׂמֵחָה לִרְאוֹת לְךָ", "אֲנִי שְׂמֵחָה רוֹאָה אוֹתְךָ", "אֲנִי שָׂמֵחַ לִרְאוֹת אוֹתְךָ"] } },
      { english: "she saw that the door was open", hebrew: "הִיא רָאֲתָה שֶׁהַדֶּלֶת פְּתוּחָה", wrong: ["הִיא רָאָה שֶׁהַדֶּלֶת פְּתוּחָה", "הִיא נִרְאֵית שֶׁהַדֶּלֶת פְּתוּחָה", "הִיא רָאֲתָה שֶׁהַדֶּלֶת פָּתוּחַ"] },
      { english: "the teacher (f.) sees everything", hebrew: "הַמּוֹרָה רוֹאָה הַכֹּל", wrong: ["הַמּוֹרָה רוֹאֶה הַכֹּל", "הַמּוֹרָה נִרְאֵית הַכֹּל", "הַמּוֹרָה רוֹאוֹת הַכֹּל"] },
    ],
  },
  {
    id: "root-ntn", kind: "root", pattern: "paal", icon: "🌱", english: "Root נ־ת־ן: give", hebrew: "שֹׁרֶשׁ נ־ת־ן: לָתֵת",
    words: [
      { english: "to give", hebrew: "לָתֵת", wrong: ["נוֹתֵן", "מַתָּנָה", "לָקַחַת"] },
      { english: "he gives", hebrew: "הוּא נוֹתֵן", wrong: ["הוּא נוֹתֶנֶת", "הוּא נוֹתְנִים", "הוּא נָתַן"] },
      { english: "she gives", hebrew: "הִיא נוֹתֶנֶת", wrong: ["הִיא נוֹתֵן", "הִיא נוֹתְנוֹת", "הִיא נָתְנָה"] },
      { english: "they (m.) give", hebrew: "הֵם נוֹתְנִים", wrong: ["הֵם נוֹתְנוֹת", "הֵם נוֹתֵן", "הֵם נָתְנוּ"] },
      { english: "they (f.) give", hebrew: "הֵן נוֹתְנוֹת", wrong: ["הֵן נוֹתְנִים", "הֵן נוֹתֶנֶת", "הֵן נָתְנוּ"] },
      { english: "a gift", hebrew: "מַתָּנָה", wrong: ["נְתוּנִים", "נוֹתֵן", "חֲבִילָה"] },
      { english: "give me (to a boy)", hebrew: "תֵּן לִי", wrong: ["תְּנִי לִי", "נוֹתֵן לִי", "תֵּן אוֹתִי"] },
      // נוֹתֵן + אֶת (the thing) + לְ (to whom) / no אֶת for "a …" / נוֹתֵן לְ + infinitive = lets
      { english: "he gives the book to Dana", hebrew: "הוּא נוֹתֵן אֶת הַסֵּפֶר לְדָנָה", wrong: ["הוּא נוֹתֵן אֶת הַסֵּפֶר אֶת דָּנָה", "הוּא נוֹתֵן לַסֵּפֶר לְדָנָה", "הוּא נוֹתֵן אֶת הַסֵּפֶר מִדָּנָה"] },
      { english: "she gives Mom a gift", hebrew: "הִיא נוֹתֶנֶת מַתָּנָה לְאִמָּא", wrong: ["הִיא נוֹתֶנֶת מַתָּנָה אֶת אִמָּא", "הִיא נוֹתֶנֶת אֶת מַתָּנָה לְאִמָּא", "הִיא נוֹתֶנֶת מַתָּנָה מֵאִמָּא"] },
      { english: "the teacher (m.) gives us homework", hebrew: "הַמּוֹרֶה נוֹתֵן לָנוּ שִׁעוּרֵי בַּיִת", wrong: ["הַמּוֹרֶה נוֹתֵן אוֹתָנוּ שִׁעוּרֵי בַּיִת", "הַמּוֹרֶה נוֹתֵן לָהֶם שִׁעוּרֵי בַּיִת", "הַמּוֹרֶה נוֹתֶנֶת לָנוּ שִׁעוּרֵי בַּיִת"] },
      { english: "Mom lets him play", hebrew: "אִמָּא נוֹתֶנֶת לוֹ לְשַׂחֵק", wrong: ["אִמָּא נוֹתֶנֶת אוֹתוֹ לְשַׂחֵק", "אִמָּא נוֹתֶנֶת לוֹ מְשַׂחֵק", "אִמָּא נוֹתֵן לוֹ לְשַׂחֵק"] },
      // The describing word from the root (נָתוּן = given) vs. the action (נוֹתֵן = gives)
      { english: "at any given moment", hebrew: "בְּכָל רֶגַע נָתוּן", wrong: ["בְּכָל רֶגַע נוֹתֵן", "בְּכָל רֶגַע נְתוּנָה", "בְּכָל רֶגַע נָתַן"] },
      { english: "data (given facts)", hebrew: "נְתוּנִים", wrong: ["נוֹתְנִים", "מַתָּנוֹת", "נְתוּנוֹת"] },
      // ----- More practice (2026-11-12) -----
      // More present tense: I, you, we
      { english: "I give", hebrew: "אֲנִי נוֹתֵן", wrong: ["אֲנִי נוֹתְנִים", "אֲנִי נָתַתִּי", "אֲנִי נָתוּן"], f: { hebrew: "אֲנִי נוֹתֶנֶת", wrong: ["אֲנִי נוֹתְנוֹת", "אֲנִי נָתַתִּי", "אֲנִי נְתוּנָה"] } },
      { english: "you (m.) give", hebrew: "אַתָּה נוֹתֵן", wrong: ["אַתָּה נוֹתֶנֶת", "אַתָּה נוֹתְנִים", "אַתָּה נָתַתָּ"] },
      { english: "you (f.) give", hebrew: "אַתְּ נוֹתֶנֶת", wrong: ["אַתְּ נוֹתֵן", "אַתְּ נוֹתְנוֹת", "אַתְּ נָתַתְּ"] },
      { english: "we give", hebrew: "אֲנַחְנוּ נוֹתְנִים", wrong: ["אֲנַחְנוּ נוֹתֵן", "אֲנַחְנוּ נָתַנּוּ", "אֲנַחְנוּ נְתוּנִים"], f: { hebrew: "אֲנַחְנוּ נוֹתְנוֹת", wrong: ["אֲנַחְנוּ נוֹתֶנֶת", "אֲנַחְנוּ נָתַנּוּ", "אֲנַחְנוּ נְתוּנוֹת"] } },
      // Past, future, and "give!"
      { english: "I gave", hebrew: "נָתַתִּי", wrong: ["נָתַנּוּ", "נָתַתָּ", "אֶתֵּן"] },
      { english: "he gave", hebrew: "הוּא נָתַן", wrong: ["הוּא נָתְנָה", "הוּא נוֹתֵן", "הוּא יִתֵּן"] },
      { english: "she gave", hebrew: "הִיא נָתְנָה", wrong: ["הִיא נָתַן", "הִיא נוֹתֶנֶת", "הִיא תִּתֵּן"] },
      { english: "they (m.) gave", hebrew: "הֵם נָתְנוּ", wrong: ["הֵם נָתַנּוּ", "הֵם נוֹתְנִים", "הֵם יִתְּנוּ"] },
      { english: "I will give", hebrew: "אֶתֵּן", wrong: ["נִתֵּן", "נָתַתִּי", "תִּתֵּן"] },
      { english: "give me (to a girl)", hebrew: "תְּנִי לִי", wrong: ["תֵּן לִי", "נוֹתֶנֶת לִי", "תְּנִי אוֹתִי"] },
      { english: "give him the ball (to a boy)", hebrew: "תֵּן לוֹ אֶת הַכַּדּוּר", wrong: ["תֵּן אוֹתוֹ אֶת הַכַּדּוּר", "תֵּן לוֹ הַכַּדּוּר", "תְּנִי לוֹ אֶת הַכַּדּוּר"] },
      // Everyday sentences: נוֹתֵן + (אֶת) + לְ
      { english: "Dad gave me money", hebrew: "אַבָּא נָתַן לִי כֶּסֶף", wrong: ["אַבָּא נָתַן אוֹתִי כֶּסֶף", "אַבָּא נָתַן לִי אֶת כֶּסֶף", "אַבָּא נָתְנָה לִי כֶּסֶף"] },
      { english: "we gave Grandma flowers", hebrew: "נָתַנּוּ לְסַבְתָּא פְּרָחִים", wrong: ["נָתַנּוּ אֶת סַבְתָּא פְּרָחִים", "נָתַנּוּ מִסָּבְתָא פְּרָחִים", "נִתֵּן לְסַבְתָּא פְּרָחִים"] },
      { english: "I will give you (m.) my number", hebrew: "אֶתֵּן לְךָ אֶת הַמִּסְפָּר שֶׁלִּי", wrong: ["אֶתֵּן אוֹתְךָ אֶת הַמִּסְפָּר שֶׁלִּי", "אֶתֵּן לְךָ הַמִּסְפָּר שֶׁלִּי", "נָתַתִּי לְךָ אֶת הַמִּסְפָּר שֶׁלִּי"] },
      { english: "the teacher (f.) gives the class a test", hebrew: "הַמּוֹרָה נוֹתֶנֶת מִבְחָן לַכִּתָּה", wrong: ["הַמּוֹרָה נוֹתֶנֶת מִבְחָן אֶת הַכִּתָּה", "הַמּוֹרָה נוֹתֵן מִבְחָן לַכִּתָּה", "הַמּוֹרָה נוֹתֶנֶת אֶת מִבְחָן לַכִּתָּה"] },
      { english: "the singer (f.) gives an interview", hebrew: "הַזַּמֶּרֶת נוֹתֶנֶת רֵאָיוֹן", wrong: ["הַזַּמֶּרֶת נוֹתֵן רֵאָיוֹן", "הַזַּמֶּרֶת נוֹתֶנֶת אֶת רֵאָיוֹן", "הַזַּמֶּרֶת נְתוּנָה רֵאָיוֹן"] },
      { english: "she gave me an idea", hebrew: "הִיא נָתְנָה לִי רַעְיוֹן", wrong: ["הִיא נָתְנָה אוֹתִי רַעְיוֹן", "הִיא נָתַן לִי רַעְיוֹן", "הִיא נָתְנָה לִי אֶת רַעְיוֹן"] },
      { english: "they (f.) give us advice", hebrew: "הֵן נוֹתְנוֹת לָנוּ עֵצוֹת", wrong: ["הֵן נוֹתְנִים לָנוּ עֵצוֹת", "הֵן נוֹתְנוֹת אוֹתָנוּ עֵצוֹת", "הֵן נוֹתְנוֹת לָנוּ אֶת עֵצוֹת"] },
      { english: "we gave him a chance", hebrew: "נָתַנּוּ לוֹ הִזְדַּמְּנוּת", wrong: ["נָתַנּוּ אוֹתוֹ הִזְדַּמְּנוּת", "נָתַנּוּ לוֹ אֶת הִזְדַּמְּנוּת", "נִתֵּן לוֹ הִזְדַּמְּנוּת"] },
      { english: "the store gives students a discount", hebrew: "הַחֲנוּת נוֹתֶנֶת הֲנָחָה לְתַלְמִידִים", wrong: ["הַחֲנוּת נוֹתֵן הֲנָחָה לְתַלְמִידִים", "הַחֲנוּת נוֹתֶנֶת הֲנָחָה אֶת תַּלְמִידִים", "הַחֲנוּת נוֹתֶנֶת אֶת הֲנָחָה לְתַלְמִידִים"] },
      { english: "who gave you (f.) the flowers?", hebrew: "מִי נָתַן לָךְ אֶת הַפְּרָחִים?", wrong: ["מִי נָתַן אוֹתָךְ אֶת הַפְּרָחִים?", "מִי נָתַן לְךָ אֶת הַפְּרָחִים?", "מִי נָתַן לָךְ הַפְּרָחִים?"] },
      { english: "every morning I give the dog food", hebrew: "כָּל בֹּקֶר אֲנִי נוֹתֵן אֹכֶל לַכֶּלֶב", wrong: ["כָּל בֹּקֶר אֲנִי נוֹתֵן אֹכֶל אֶת הַכֶּלֶב", "כָּל בֹּקֶר אֲנִי נוֹתֵן אֶת אֹכֶל לַכֶּלֶב", "כָּל בֹּקֶר אֲנִי נָתַתִּי אֹכֶל לַכֶּלֶב"], f: { hebrew: "כָּל בֹּקֶר אֲנִי נוֹתֶנֶת אֹכֶל לַכֶּלֶב", wrong: ["כָּל בֹּקֶר אֲנִי נוֹתֶנֶת אֹכֶל אֶת הַכֶּלֶב", "כָּל בֹּקֶר אֲנִי נוֹתֶנֶת אֶת אֹכֶל לַכֶּלֶב", "כָּל בֹּקֶר אֲנִי נָתַתִּי אֹכֶל לַכֶּלֶב"] } },
      // נוֹתֵן לְ + infinitive = lets
      { english: "my parents don't let me go out", hebrew: "הַהוֹרִים שֶׁלִּי לֹא נוֹתְנִים לִי לָצֵאת", wrong: ["הַהוֹרִים שֶׁלִּי לֹא נוֹתְנִים אוֹתִי לָצֵאת", "הַהוֹרִים שֶׁלִּי לֹא נוֹתְנִים לִי יוֹצֵא", "הַהוֹרִים שֶׁלִּי לֹא נוֹתֵן לִי לָצֵאת"] },
      { english: "let me see! (to a boy)", hebrew: "תֵּן לִי לִרְאוֹת!", wrong: ["תֵּן אוֹתִי לִרְאוֹת!", "תֵּן לִי רוֹאֶה!", "תְּנִי לִי לִרְאוֹת!"] },
      { english: "the coach (m.) lets us rest", hebrew: "הַמְּאַמֵּן נוֹתֵן לָנוּ לָנוּחַ", wrong: ["הַמְּאַמֵּן נוֹתֵן אוֹתָנוּ לָנוּחַ", "הַמְּאַמֵּן נוֹתֵן לָנוּ נָחִים", "הַמְּאַמֵּן נוֹתֵן לָהֶם לָנוּחַ"] },
      // Nouns from the root: מַתָּנוֹת (gifts), נְתִינָה (giving), נְתוּנִים (data)
      { english: "the gifts", hebrew: "הַמַּתָּנוֹת", wrong: ["הַמַּתָּנָה", "הַמַּתָּנִים", "הַנְּתוּנִים"] },
      { english: "a birthday present", hebrew: "מַתְּנַת יוֹם הֻלֶּדֶת", wrong: ["מַתָּנָה יוֹם הֻלֶּדֶת", "מַתְּנוֹת יוֹם הֻלֶּדֶת", "נְתִינַת יוֹם הֻלֶּדֶת"] },
      { english: "I bought a gift for my friend (m.)", hebrew: "קָנִיתִי מַתָּנָה לְחָבֵר שֶׁלִּי", wrong: ["קָנִיתִי אֶת מַתָּנָה לְחָבֵר שֶׁלִּי", "קָנִיתִי מַתָּנָה מֵחָבֵר שֶׁלִּי", "קָנִיתִי מַתָּנוֹת לְחָבֵר שֶׁלִּי"] },
      { english: "thank you for the gift", hebrew: "תּוֹדָה עַל הַמַּתָּנָה", wrong: ["תּוֹדָה לַמַּתָּנָה", "תּוֹדָה בַּמַּתָּנָה", "תּוֹדָה עַל הַמַּתָּנוֹת"] },
      { english: "giving", hebrew: "נְתִינָה", wrong: ["נְתוּנָה", "מַתָּנָה", "נוֹתֶנֶת"] },
      { english: "giving is important", hebrew: "הַנְּתִינָה חֲשׁוּבָה", wrong: ["הַנְּתִינָה חָשׁוּב", "הַנְּתוּנָה חֲשׁוּבָה", "הַנּוֹתֶנֶת חֲשׁוּבָה"] },
      { english: "the data are interesting", hebrew: "הַנְּתוּנִים מְעַנְיְנִים", wrong: ["הַנְּתוּנִים מְעַנְיְנוֹת", "הַנְּתוּנוֹת מְעַנְיְנִים", "הַנּוֹתְנִים מְעַנְיְנִים"] },
      { english: "we collect data for the project", hebrew: "אֲנַחְנוּ אוֹסְפִים נְתוּנִים לַפְּרוֹיֶקְט", wrong: ["אֲנַחְנוּ אוֹסְפִים נוֹתְנִים לַפְּרוֹיֶקְט", "אֲנַחְנוּ אוֹסְפִים מַתָּנוֹת לַפְּרוֹיֶקְט", "אֲנַחְנוּ אוֹסְפִים נְתוּנוֹת לַפְּרוֹיֶקְט"], f: { hebrew: "אֲנַחְנוּ אוֹסְפוֹת נְתוּנִים לַפְּרוֹיֶקְט", wrong: ["אֲנַחְנוּ אוֹסְפוֹת נוֹתְנִים לַפְּרוֹיֶקְט", "אֲנַחְנוּ אוֹסְפוֹת מַתָּנוֹת לַפְּרוֹיֶקְט", "אֲנַחְנוּ אוֹסְפוֹת נְתוּנוֹת לַפְּרוֹיֶקְט"] } },
      // Describing word נָתוּן (given; נָתוּן בְּלַחַץ = under pressure): m., f., m. plural, f. plural
      { english: "given (m.)", hebrew: "נָתוּן", wrong: ["נוֹתֵן", "נְתוּנָה", "נְתוּנִים"] },
      { english: "given (f.)", hebrew: "נְתוּנָה", wrong: ["נָתוּן", "נוֹתֶנֶת", "נְתוּנוֹת"] },
      { english: "given (m. plural)", hebrew: "נְתוּנִים", wrong: ["נְתוּנוֹת", "נוֹתְנִים", "נָתוּן"] },
      { english: "given (f. plural)", hebrew: "נְתוּנוֹת", wrong: ["נְתוּנִים", "נוֹתְנוֹת", "נְתוּנָה"] },
      { english: "at a given time", hebrew: "בִּזְמַן נָתוּן", wrong: ["בִּזְמַן נְתוּנָה", "בִּזְמַן נוֹתֵן", "בִּזְמַן נָתַן"] },
      { english: "the given numbers", hebrew: "הַמִּסְפָּרִים הַנְּתוּנִים", wrong: ["הַמִּסְפָּרִים הַנְּתוּנוֹת", "הַמִּסְפָּרִים הַנּוֹתְנִים", "הַמִּסְפָּרִים נְתוּנִים"] },
      { english: "she is under pressure", hebrew: "הִיא נְתוּנָה בְּלַחַץ", wrong: ["הִיא נָתוּן בְּלַחַץ", "הִיא נוֹתֶנֶת בְּלַחַץ", "הִיא נְתוּנָה לַלַּחַץ"] },
      { english: "the girls are under pressure before the test", hebrew: "הַבָּנוֹת נְתוּנוֹת בְּלַחַץ לִפְנֵי הַמִּבְחָן", wrong: ["הַבָּנוֹת נְתוּנִים בְּלַחַץ לִפְנֵי הַמִּבְחָן", "הַבָּנוֹת נוֹתְנוֹת בְּלַחַץ לִפְנֵי הַמִּבְחָן", "הַבָּנוֹת נְתוּנָה בְּלַחַץ לִפְנֵי הַמִּבְחָן"] },
    ],
  },
  // ----- Roots with a describing word (2026-11-12): the action (פּוֹתֵחַ = opens) next to the
  // description made from the same root (פָּתוּחַ = open). The wrong answers swap them, and the gender.
  {
    id: "root-pth-sgr", kind: "root", pattern: "paal", icon: "🌱", english: "Roots פ־ת־ח + ס־ג־ר: open & close", hebrew: "שָׁרָשִׁים פ־ת־ח + ס־ג־ר: לִפְתֹּחַ, לִסְגֹּר",
    words: [
      { english: "to open", hebrew: "לִפְתֹּחַ", wrong: ["פּוֹתֵחַ", "פָּתוּחַ", "לִסְגֹּר"] },
      { english: "to close", hebrew: "לִסְגֹּר", wrong: ["סוֹגֵר", "סָגוּר", "לִפְתֹּחַ"] },
      { english: "he opens", hebrew: "הוּא פּוֹתֵחַ", wrong: ["הוּא פָּתוּחַ", "הוּא פּוֹתַחַת", "הוּא פָּתַח"] },
      { english: "she opens", hebrew: "הִיא פּוֹתַחַת", wrong: ["הִיא פְּתוּחָה", "הִיא פּוֹתֵחַ", "הִיא פָּתְחָה"] },
      { english: "she closes", hebrew: "הִיא סוֹגֶרֶת", wrong: ["הִיא סְגוּרָה", "הִיא סוֹגֵר", "הִיא סָגְרָה"] },
      { english: "open (m.)", hebrew: "פָּתוּחַ", wrong: ["פּוֹתֵחַ", "פְּתוּחָה", "נִפְתַּח"] },
      { english: "open (f.)", hebrew: "פְּתוּחָה", wrong: ["פּוֹתַחַת", "פָּתוּחַ", "נִפְתְּחָה"] },
      { english: "closed (m.)", hebrew: "סָגוּר", wrong: ["סוֹגֵר", "סְגוּרָה", "נִסְגַּר"] },
      { english: "closed (f.)", hebrew: "סְגוּרָה", wrong: ["סוֹגֶרֶת", "סָגוּר", "נִסְגְּרָה"] },
      { english: "a key", hebrew: "מַפְתֵּחַ", wrong: ["פֶּתַח", "פְּתִיחָה", "מִסְגֶּרֶת"] },
      { english: "an opening, an entrance", hebrew: "פֶּתַח", wrong: ["מַפְתֵּחַ", "פְּתִיחָה", "סֶגֶר"] },
      { english: "a lockdown", hebrew: "סֶגֶר", wrong: ["מִסְגֶּרֶת", "סָגוּר", "פֶּתַח"] },
      { english: "a frame", hebrew: "מִסְגֶּרֶת", wrong: ["סֶגֶר", "מַפְתֵּחַ", "סְגִירָה"] },
      { english: "he opens the door", hebrew: "הוּא פּוֹתֵחַ אֶת הַדֶּלֶת", wrong: ["הוּא פָּתוּחַ אֶת הַדֶּלֶת", "הוּא פּוֹתֵחַ הַדֶּלֶת", "הוּא פּוֹתֵחַ לַדֶּלֶת"] },
      { english: "the door is open", hebrew: "הַדֶּלֶת פְּתוּחָה", wrong: ["הַדֶּלֶת פּוֹתַחַת", "הַדֶּלֶת פָּתוּחַ", "הַדֶּלֶת פּוֹתֵחַ"] },
      { english: "she closes the store", hebrew: "הִיא סוֹגֶרֶת אֶת הַחֲנוּת", wrong: ["הִיא סְגוּרָה אֶת הַחֲנוּת", "הִיא סוֹגֶרֶת הַחֲנוּת", "הִיא סוֹגֵר אֶת הַחֲנוּת"] },
      { english: "the store is closed", hebrew: "הַחֲנוּת סְגוּרָה", wrong: ["הַחֲנוּת סוֹגֶרֶת", "הַחֲנוּת סָגוּר", "הַחֲנוּת סוֹגֵר"] },
      { english: "the key opens the door", hebrew: "הַמַּפְתֵּחַ פּוֹתֵחַ אֶת הַדֶּלֶת", wrong: ["הַמַּפְתֵּחַ פָּתוּחַ אֶת הַדֶּלֶת", "הַמַּפְתֵּחַ פּוֹתַחַת אֶת הַדֶּלֶת", "הַמַּפְתֵּחַ פּוֹתֵחַ לַדֶּלֶת"] },
      { english: "the windows are closed", hebrew: "הַחַלּוֹנוֹת סְגוּרִים", wrong: ["הַחַלּוֹנוֹת סְגוּרוֹת", "הַחַלּוֹנוֹת סוֹגְרִים", "הַחַלּוֹנוֹת סָגוּר"] },
      // ----- More practice (2026-11-12) -----
      // More present-tense forms
      { english: "he closes", hebrew: "הוּא סוֹגֵר", wrong: ["הוּא סָגוּר", "הוּא סוֹגֶרֶת", "הוּא סָגַר"] },
      { english: "I open", hebrew: "אֲנִי פּוֹתֵחַ", wrong: ["אֲנִי פָּתוּחַ", "אֲנִי פּוֹתַחַת", "אֲנִי פָּתַחְתִּי"], f: { hebrew: "אֲנִי פּוֹתַחַת", wrong: ["אֲנִי פְּתוּחָה", "אֲנִי פּוֹתֵחַ", "אֲנִי פָּתַחְתִּי"] } },
      { english: "I close", hebrew: "אֲנִי סוֹגֵר", wrong: ["אֲנִי סָגוּר", "אֲנִי סוֹגֶרֶת", "אֲנִי סָגַרְתִּי"], f: { hebrew: "אֲנִי סוֹגֶרֶת", wrong: ["אֲנִי סְגוּרָה", "אֲנִי סוֹגֵר", "אֲנִי סָגַרְתִּי"] } },
      { english: "you (m.) open", hebrew: "אַתָּה פּוֹתֵחַ", wrong: ["אַתָּה פּוֹתַחַת", "אַתָּה פָּתוּחַ", "אַתָּה פָּתַחְתָּ"] },
      { english: "you (f.) close", hebrew: "אַתְּ סוֹגֶרֶת", wrong: ["אַתְּ סוֹגֵר", "אַתְּ סְגוּרָה", "אַתְּ סָגַרְתְּ"] },
      { english: "we open", hebrew: "אֲנַחְנוּ פּוֹתְחִים", wrong: ["אֲנַחְנוּ פְּתוּחִים", "אֲנַחְנוּ פּוֹתֵחַ", "אֲנַחְנוּ פָּתַחְנוּ"], f: { hebrew: "אֲנַחְנוּ פּוֹתְחוֹת", wrong: ["אֲנַחְנוּ פְּתוּחוֹת", "אֲנַחְנוּ פּוֹתַחַת", "אֲנַחְנוּ פָּתַחְנוּ"] } },
      { english: "they (m.) close", hebrew: "הֵם סוֹגְרִים", wrong: ["הֵם סוֹגְרוֹת", "הֵם סְגוּרִים", "הֵם סָגְרוּ"] },
      { english: "they (f.) open", hebrew: "הֵן פּוֹתְחוֹת", wrong: ["הֵן פּוֹתְחִים", "הֵן פְּתוּחוֹת", "הֵן פָּתְחוּ"] },
      // Plural describing words
      { english: "open (plural, m.)", hebrew: "פְּתוּחִים", wrong: ["פְּתוּחוֹת", "פּוֹתְחִים", "פָּתוּחַ"] },
      { english: "open (plural, f.)", hebrew: "פְּתוּחוֹת", wrong: ["פְּתוּחִים", "פּוֹתְחוֹת", "פְּתוּחָה"] },
      { english: "closed (plural, m.)", hebrew: "סְגוּרִים", wrong: ["סְגוּרוֹת", "סוֹגְרִים", "סָגוּר"] },
      { english: "closed (plural, f.)", hebrew: "סְגוּרוֹת", wrong: ["סְגוּרִים", "סוֹגְרוֹת", "סְגוּרָה"] },
      // More nouns from the roots
      { english: "keys", hebrew: "מַפְתְּחוֹת", wrong: ["מַפְתֵּחַ", "מַפְתְּחִים", "פְּתָחִים"] },
      { english: "opening (the act of opening), a start", hebrew: "פְּתִיחָה", wrong: ["פֶּתַח", "פְּתוּחָה", "סְגִירָה"] },
      { english: "closing, a closure", hebrew: "סְגִירָה", wrong: ["סֶגֶר", "סְגוּרָה", "פְּתִיחָה"] },
      { english: "the opening of the school year", hebrew: "פְּתִיחַת שְׁנַת הַלִּמּוּדִים", wrong: ["פֶּתַח שְׁנַת הַלִּמּוּדִים", "סְגִירַת שְׁנַת הַלִּמּוּדִים", "פְּתוּחַת שְׁנַת הַלִּמּוּדִים"] },
      { english: "I lost the keys", hebrew: "אִבַּדְתִּי אֶת הַמַּפְתְּחוֹת", wrong: ["אִבַּדְתִּי אֶת הַמַּפְתֵּחַ", "אִבַּדְתִּי הַמַּפְתְּחוֹת", "אִבַּדְתִּי אֶת הַפְּתָחִים"] },
      { english: "Mom opens the door with a key", hebrew: "אִמָּא פּוֹתַחַת אֶת הַדֶּלֶת בְּמַפְתֵּחַ", wrong: ["אִמָּא פּוֹתַחַת אֶת הַדֶּלֶת לְמַפְתֵּחַ", "אִמָּא פּוֹתֵחַ אֶת הַדֶּלֶת בְּמַפְתֵּחַ", "אִמָּא פְּתוּחָה אֶת הַדֶּלֶת בְּמַפְתֵּחַ"] },
      // Past and future
      { english: "he opened the store", hebrew: "הוּא פָּתַח אֶת הַחֲנוּת", wrong: ["הוּא פָּתַח הַחֲנוּת", "הוּא פָּתְחָה אֶת הַחֲנוּת", "הוּא פּוֹתֵחַ אֶת הַחֲנוּת"] },
      { english: "I closed the window", hebrew: "סָגַרְתִּי אֶת הַחַלּוֹן", wrong: ["סָגַרְתִּי הַחַלּוֹן", "סָגַרְנוּ אֶת הַחַלּוֹן", "אֲנִי סָגוּר אֶת הַחַלּוֹן"] },
      { english: "she opened the window", hebrew: "הִיא פָּתְחָה אֶת הַחַלּוֹן", wrong: ["הִיא פָּתַח אֶת הַחַלּוֹן", "הִיא נִפְתְּחָה אֶת הַחַלּוֹן", "הִיא פְּתוּחָה אֶת הַחַלּוֹן"] },
      { english: "I'll open the present later", hebrew: "אֲנִי אֶפְתַּח אֶת הַמַּתָּנָה אַחַר כָּךְ", wrong: ["אֲנִי אֶפְתַּח הַמַּתָּנָה אַחַר כָּךְ", "אֲנִי פָּתַחְתִּי אֶת הַמַּתָּנָה אַחַר כָּךְ", "אֲנִי נִפְתַּח אֶת הַמַּתָּנָה אַחַר כָּךְ"] },
      // "It opened / it closed" (by itself) vs. "it is open / closed"
      { english: "the window is closed", hebrew: "הַחַלּוֹן סָגוּר", wrong: ["הַחַלּוֹן סְגוּרָה", "הַחַלּוֹן סוֹגֵר", "הַחַלּוֹן נִסְגְּרָה"] },
      { english: "the doors are open", hebrew: "הַדְּלָתוֹת פְּתוּחוֹת", wrong: ["הַדְּלָתוֹת פְּתוּחִים", "הַדְּלָתוֹת פּוֹתְחוֹת", "הַדְּלָתוֹת פְּתוּחָה"] },
      { english: "the books are open", hebrew: "הַסְּפָרִים פְּתוּחִים", wrong: ["הַסְּפָרִים פְּתוּחוֹת", "הַסְּפָרִים פּוֹתְחִים", "הַסְּפָרִים פָּתוּחַ"] },
      { english: "the shops are closed on Shabbat", hebrew: "הַחֲנֻיּוֹת סְגוּרוֹת בְּשַׁבָּת", wrong: ["הַחֲנֻיּוֹת סְגוּרִים בְּשַׁבָּת", "הַחֲנֻיּוֹת סְגוּרָה בְּשַׁבָּת", "הַחֲנֻיּוֹת פְּתוּחוֹת בְּשַׁבָּת"] },
      { english: "my eyes are closed", hebrew: "הָעֵינַיִם שֶׁלִּי סְגוּרוֹת", wrong: ["הָעֵינַיִם שֶׁלִּי סְגוּרִים", "הָעֵינַיִם שֶׁלִּי סוֹגְרוֹת", "הָעֵינַיִם שֶׁלִּי סְגוּרָה"] },
      { english: "the windows were open all day", hebrew: "הַחַלּוֹנוֹת הָיוּ פְּתוּחִים כָּל הַיּוֹם", wrong: ["הַחַלּוֹנוֹת הָיוּ פְּתוּחוֹת כָּל הַיּוֹם", "הַחַלּוֹנוֹת הָיוּ פּוֹתְחִים כָּל הַיּוֹם", "הַחַלּוֹנוֹת הָיָה פְּתוּחִים כָּל הַיּוֹם"] },
      { english: "the door is closed, but the window is open", hebrew: "הַדֶּלֶת סְגוּרָה, אֲבָל הַחַלּוֹן פָּתוּחַ", wrong: ["הַדֶּלֶת סָגוּר, אֲבָל הַחַלּוֹן פָּתוּחַ", "הַדֶּלֶת סְגוּרָה, אֲבָל הַחַלּוֹן פְּתוּחָה", "הַדֶּלֶת סוֹגֶרֶת, אֲבָל הַחַלּוֹן פּוֹתֵחַ"] },
      // Everyday sentences: אֶת, object pronouns, commands
      { english: "the girls close the notebooks", hebrew: "הַבָּנוֹת סוֹגְרוֹת אֶת הַמַּחְבָּרוֹת", wrong: ["הַבָּנוֹת סוֹגְרִים אֶת הַמַּחְבָּרוֹת", "הַבָּנוֹת סְגוּרוֹת אֶת הַמַּחְבָּרוֹת", "הַבָּנוֹת סוֹגְרוֹת הַמַּחְבָּרוֹת"] },
      { english: "she opens it (the window)", hebrew: "הִיא פּוֹתַחַת אוֹתוֹ", wrong: ["הִיא פּוֹתַחַת אוֹתָהּ", "הִיא פּוֹתַחַת לוֹ", "הִיא פְּתוּחָה אוֹתוֹ"] },
      { english: "he closes it (the door)", hebrew: "הוּא סוֹגֵר אוֹתָהּ", wrong: ["הוּא סוֹגֵר אוֹתוֹ", "הוּא סוֹגֵר לָהּ", "הוּא סָגוּר אוֹתָהּ"] },
      { english: "open the books! (to the class)", hebrew: "פִּתְחוּ אֶת הַסְּפָרִים!", wrong: ["פִּתְחוּ הַסְּפָרִים!", "פְּתוּחִים אֶת הַסְּפָרִים!", "סִגְרוּ אֶת הַסְּפָרִים!"] },
      { english: "close the door, please (to a boy)", hebrew: "סְגֹר אֶת הַדֶּלֶת, בְּבַקָּשָׁה", wrong: ["סָגוּר אֶת הַדֶּלֶת, בְּבַקָּשָׁה", "סְגֹר הַדֶּלֶת, בְּבַקָּשָׁה", "סִגְרִי אֶת הַדֶּלֶת, בְּבַקָּשָׁה"] },
    ],
  },
  {
    id: "root-shbr", kind: "root", pattern: "paal", icon: "🌱", english: "Root ש־ב־ר: break", hebrew: "שֹׁרֶשׁ ש־ב־ר: לִשְׁבֹּר",
    words: [
      { english: "to break", hebrew: "לִשְׁבֹּר", wrong: ["שׁוֹבֵר", "שָׁבוּר", "לְתַקֵּן"] },
      { english: "he breaks", hebrew: "הוּא שׁוֹבֵר", wrong: ["הוּא שָׁבוּר", "הוּא שׁוֹבֶרֶת", "הוּא שָׁבַר"] },
      { english: "she breaks", hebrew: "הִיא שׁוֹבֶרֶת", wrong: ["הִיא שְׁבוּרָה", "הִיא שׁוֹבֵר", "הִיא שָׁבְרָה"] },
      { english: "broken (m.)", hebrew: "שָׁבוּר", wrong: ["שׁוֹבֵר", "שְׁבוּרָה", "נִשְׁבַּר"] },
      { english: "broken (f.)", hebrew: "שְׁבוּרָה", wrong: ["שׁוֹבֶרֶת", "שָׁבוּר", "נִשְׁבְּרָה"] },
      { english: "broken (plural, m.)", hebrew: "שְׁבוּרִים", wrong: ["שְׁבוּרוֹת", "שׁוֹבְרִים", "שָׁבוּר"] },
      { english: "a fracture, a break", hebrew: "שֶׁבֶר", wrong: ["מַשְׁבֵּר", "שָׁבוּר", "שְׁבִירָה"] },
      { english: "a crisis", hebrew: "מַשְׁבֵּר", wrong: ["שֶׁבֶר", "שָׁבוּר", "מִשְׁבָּר"] },
      { english: "he breaks the cup", hebrew: "הוּא שׁוֹבֵר אֶת הַכּוֹס", wrong: ["הוּא שָׁבוּר אֶת הַכּוֹס", "הוּא שׁוֹבֵר הַכּוֹס", "הוּא שׁוֹבֵר לַכּוֹס"] },
      { english: "the cup is broken", hebrew: "הַכּוֹס שְׁבוּרָה", wrong: ["הַכּוֹס שָׁבוּר", "הַכּוֹס שׁוֹבֶרֶת", "הַכּוֹס שׁוֹבֵר"] },
      { english: "my leg is broken", hebrew: "הָרֶגֶל שֶׁלִּי שְׁבוּרָה", wrong: ["הָרֶגֶל שֶׁלִּי שָׁבוּר", "הָרֶגֶל שֶׁלִּי שׁוֹבֶרֶת", "הָרֶגֶל שֶׁלִּי שָׁבְרָה"] },
      { english: "the toys are broken", hebrew: "הַצַּעֲצוּעִים שְׁבוּרִים", wrong: ["הַצַּעֲצוּעִים שְׁבוּרוֹת", "הַצַּעֲצוּעִים שׁוֹבְרִים", "הַצַּעֲצוּעִים שָׁבוּר"] },
      { english: "she broke the window", hebrew: "הִיא שָׁבְרָה אֶת הַחַלּוֹן", wrong: ["הִיא שְׁבוּרָה אֶת הַחַלּוֹן", "הִיא נִשְׁבְּרָה אֶת הַחַלּוֹן", "הִיא שָׁבְרָה הַחַלּוֹן"] },
      // ----- More practice (2026-11-12) -----
      // More present-tense forms
      { english: "I break", hebrew: "אֲנִי שׁוֹבֵר", wrong: ["אֲנִי שָׁבוּר", "אֲנִי שׁוֹבֶרֶת", "אֲנִי שָׁבַרְתִּי"], f: { hebrew: "אֲנִי שׁוֹבֶרֶת", wrong: ["אֲנִי שְׁבוּרָה", "אֲנִי שׁוֹבֵר", "אֲנִי שָׁבַרְתִּי"] } },
      { english: "you (m.) break", hebrew: "אַתָּה שׁוֹבֵר", wrong: ["אַתָּה שׁוֹבֶרֶת", "אַתָּה שָׁבוּר", "אַתָּה שָׁבַרְתָּ"] },
      { english: "you (f.) break", hebrew: "אַתְּ שׁוֹבֶרֶת", wrong: ["אַתְּ שׁוֹבֵר", "אַתְּ שְׁבוּרָה", "אַתְּ שָׁבַרְתְּ"] },
      { english: "we break", hebrew: "אֲנַחְנוּ שׁוֹבְרִים", wrong: ["אֲנַחְנוּ שְׁבוּרִים", "אֲנַחְנוּ שׁוֹבֵר", "אֲנַחְנוּ שָׁבַרְנוּ"], f: { hebrew: "אֲנַחְנוּ שׁוֹבְרוֹת", wrong: ["אֲנַחְנוּ שְׁבוּרוֹת", "אֲנַחְנוּ שׁוֹבֶרֶת", "אֲנַחְנוּ שָׁבַרְנוּ"] } },
      { english: "they (m.) break", hebrew: "הֵם שׁוֹבְרִים", wrong: ["הֵם שׁוֹבְרוֹת", "הֵם שְׁבוּרִים", "הֵם שָׁבְרוּ"] },
      { english: "they (f.) break", hebrew: "הֵן שׁוֹבְרוֹת", wrong: ["הֵן שׁוֹבְרִים", "הֵן שְׁבוּרוֹת", "הֵן שָׁבְרוּ"] },
      // Past and future
      { english: "he broke", hebrew: "הוּא שָׁבַר", wrong: ["הוּא שׁוֹבֵר", "הוּא שָׁבְרָה", "הוּא יִשְׁבֹּר"] },
      { english: "I broke", hebrew: "אֲנִי שָׁבַרְתִּי", wrong: ["אֲנִי שָׁבַר", "אֲנִי שָׁבַרְנוּ", "אֲנִי אֶשְׁבֹּר"] },
      { english: "they (m.) will break", hebrew: "הֵם יִשְׁבְּרוּ", wrong: ["הֵם שָׁבְרוּ", "הֵם יִשְׁבֹּר", "הֵם תִּשְׁבְּרוּ"] },
      { english: "she will break the record", hebrew: "הִיא תִּשְׁבֹּר אֶת הַשִּׂיא", wrong: ["הִיא יִשְׁבֹּר אֶת הַשִּׂיא", "הִיא שָׁבְרָה אֶת הַשִּׂיא", "הִיא תִּשְׁבֹּר הַשִּׂיא"] },
      { english: "who broke the window?", hebrew: "מִי שָׁבַר אֶת הַחַלּוֹן?", wrong: ["מִי שָׁבַר הַחַלּוֹן?", "מִי שָׁבוּר אֶת הַחַלּוֹן?", "מִי נִשְׁבַּר אֶת הַחַלּוֹן?"] },
      { english: "my brother broke his leg", hebrew: "אָחִי שָׁבַר אֶת הָרֶגֶל", wrong: ["אָחִי שָׁבַר הָרֶגֶל", "אָחִי נִשְׁבַּר אֶת הָרֶגֶל", "אָחִי שָׁבְרָה אֶת הָרֶגֶל"] },
      { english: "we didn't break anything", hebrew: "לֹא שָׁבַרְנוּ שׁוּם דָּבָר", wrong: ["לֹא שָׁבַרְתִּי שׁוּם דָּבָר", "לֹא נִשְׁבַּרְנוּ שׁוּם דָּבָר", "לֹא שְׁבוּרִים שׁוּם דָּבָר"] },
      { english: "don't break the cup! (to a boy)", hebrew: "אַל תִּשְׁבֹּר אֶת הַכּוֹס!", wrong: ["אַל תִּשְׁבְּרִי אֶת הַכּוֹס!", "אַל תִּשְׁבֹּר הַכּוֹס!", "אַל שׁוֹבֵר אֶת הַכּוֹס!"] },
      // "It broke" (by itself) vs. "it is broken"
      { english: "the plates are broken", hebrew: "הַצַּלָּחוֹת שְׁבוּרוֹת", wrong: ["הַצַּלָּחוֹת שְׁבוּרִים", "הַצַּלָּחוֹת נִשְׁבְּרוּ", "הַצַּלָּחוֹת שׁוֹבְרוֹת"] },
      // Describing words: all four forms, with nouns that agree
      { english: "broken (plural, f.)", hebrew: "שְׁבוּרוֹת", wrong: ["שְׁבוּרִים", "שׁוֹבְרוֹת", "שְׁבוּרָה"] },
      { english: "a broken chair", hebrew: "כִּסֵּא שָׁבוּר", wrong: ["כִּסֵּא שְׁבוּרָה", "כִּסֵּא שׁוֹבֵר", "כִּסֵּא נִשְׁבַּר"] },
      { english: "a broken doll", hebrew: "בֻּבָּה שְׁבוּרָה", wrong: ["בֻּבָּה שָׁבוּר", "בֻּבָּה שׁוֹבֶרֶת", "בֻּבָּה שְׁבוּרוֹת"] },
      { english: "broken bottles", hebrew: "בַּקְבּוּקִים שְׁבוּרִים", wrong: ["בַּקְבּוּקִים שְׁבוּרוֹת", "בַּקְבּוּקִים שׁוֹבְרִים", "בַּקְבּוּקִים שָׁבוּר"] },
      { english: "a broken heart", hebrew: "לֵב שָׁבוּר", wrong: ["לֵב שְׁבוּרָה", "לֵב שׁוֹבֵר", "לֵב שְׁבוּרִים"] },
      { english: "the broken window", hebrew: "הַחַלּוֹן הַשָּׁבוּר", wrong: ["הַחַלּוֹן שָׁבוּר", "הַחַלּוֹן הַשְּׁבוּרָה", "הַחַלּוֹן הַשּׁוֹבֵר"] },
      { english: "the phone screen is broken", hebrew: "הַמָּסָךְ שֶׁל הַטֶּלֶפוֹן שָׁבוּר", wrong: ["הַמָּסָךְ שֶׁל הַטֶּלֶפוֹן שְׁבוּרָה", "הַמָּסָךְ שֶׁל הַטֶּלֶפוֹן שׁוֹבֵר", "הַמָּסָךְ שֶׁל הַטֶּלֶפוֹן שְׁבוּרִים"] },
      { english: "the chairs in the classroom are broken", hebrew: "הַכִּסְאוֹת בַּכִּתָּה שְׁבוּרִים", wrong: ["הַכִּסְאוֹת בַּכִּתָּה שְׁבוּרוֹת", "הַכִּסְאוֹת בַּכִּתָּה שׁוֹבְרִים", "הַכִּסְאוֹת בַּכִּתָּה שָׁבוּר"] },
      { english: "there is broken glass on the floor", hebrew: "יֵשׁ זְכוּכִית שְׁבוּרָה עַל הָרִצְפָּה", wrong: ["יֵשׁ זְכוּכִית שָׁבוּר עַל הָרִצְפָּה", "יֵשׁ זְכוּכִית שׁוֹבֶרֶת עַל הָרִצְפָּה", "יֵשׁ זְכוּכִית שְׁבוּרָה לָרִצְפָּה"] },
      { english: "fragile (m.)", hebrew: "שָׁבִיר", wrong: ["שָׁבוּר", "שְׁבִירָה", "שׁוֹבֵר"] },
      { english: "the box is fragile", hebrew: "הַקֻּפְסָה שְׁבִירָה", wrong: ["הַקֻּפְסָה שָׁבִיר", "הַקֻּפְסָה שְׁבוּרָה", "הַקֻּפְסָה שׁוֹבֶרֶת"] },
      // More nouns from the root
      { english: "pieces (of something broken)", hebrew: "שְׁבָרִים", wrong: ["שֶׁבֶר", "שְׁבוּרִים", "מַשְׁבְּרִים"] },
      { english: "breaking (the act of breaking)", hebrew: "שְׁבִירָה", wrong: ["שֶׁבֶר", "שְׁבוּרָה", "מַשְׁבֵּר"] },
      { english: "he has a fracture in his arm", hebrew: "יֵשׁ לוֹ שֶׁבֶר בַּיָּד", wrong: ["יֵשׁ לוֹ מַשְׁבֵּר בַּיָּד", "יֵשׁ לוֹ שָׁבוּר בַּיָּד", "יֵשׁ לָהּ שֶׁבֶר בַּיָּד"] },
      { english: "the team is in a crisis", hebrew: "הַקְּבוּצָה בְּמַשְׁבֵּר", wrong: ["הַקְּבוּצָה בְּשֶׁבֶר", "הַקְּבוּצָה שְׁבוּרָה", "הַקְּבוּצָה לְמַשְׁבֵּר"] },
      // Everyday sentences: אֶת, object pronouns, שֶׁ
      { english: "she breaks the chocolate into pieces", hebrew: "הִיא שׁוֹבֶרֶת אֶת הַשּׁוֹקוֹלָד לַחֲתִיכוֹת", wrong: ["הִיא שׁוֹבֶרֶת הַשּׁוֹקוֹלָד לַחֲתִיכוֹת", "הִיא שְׁבוּרָה אֶת הַשּׁוֹקוֹלָד לַחֲתִיכוֹת", "הִיא שׁוֹבֵר אֶת הַשּׁוֹקוֹלָד לַחֲתִיכוֹת"] },
      { english: "I didn't break it (the plate)", hebrew: "לֹא שָׁבַרְתִּי אוֹתָהּ", wrong: ["לֹא שָׁבַרְתִּי אוֹתוֹ", "לֹא שָׁבַרְתִּי לָהּ", "לֹא נִשְׁבַּרְתִּי אוֹתָהּ"] },
      { english: "he broke it (the toy)", hebrew: "הוּא שָׁבַר אוֹתוֹ", wrong: ["הוּא שָׁבַר אוֹתָהּ", "הוּא שָׁבַר לוֹ", "הוּא שָׁבוּר אוֹתוֹ"] },
      { english: "the kids broke them (the pencils)", hebrew: "הַיְּלָדִים שָׁבְרוּ אוֹתָם", wrong: ["הַיְּלָדִים שָׁבְרוּ אוֹתָן", "הַיְּלָדִים שָׁבַר אוֹתָם", "הַיְּלָדִים שָׁבְרוּ לָהֶם"] },
      { english: "the boy who broke the window", hebrew: "הַיֶּלֶד שֶׁשָּׁבַר אֶת הַחַלּוֹן", wrong: ["הַיֶּלֶד שֶׁשָּׁבְרָה אֶת הַחַלּוֹן", "הַיֶּלֶד שֶׁשָּׁבַר הַחַלּוֹן", "הַיֶּלֶד שֶׁנִּשְׁבַּר אֶת הַחַלּוֹן"] },
      { english: "you (f.) broke the glass", hebrew: "אַתְּ שָׁבַרְתְּ אֶת הַכּוֹס", wrong: ["אַתְּ שָׁבַרְתָּ אֶת הַכּוֹס", "אַתְּ שְׁבוּרָה אֶת הַכּוֹס", "אַתְּ שָׁבַרְתְּ הַכּוֹס"] },
      { english: "the broken chair is in the yard", hebrew: "הַכִּסֵּא הַשָּׁבוּר בֶּחָצֵר", wrong: ["הַכִּסֵּא הַשְּׁבוּרָה בֶּחָצֵר", "הַכִּסֵּא שׁוֹבֵר בֶּחָצֵר", "הַכִּסֵּא הַשָּׁבוּר לֶחָצֵר"] },
      { english: "they (m.) will break the record", hebrew: "הֵם יִשְׁבְּרוּ אֶת הַשִּׂיא", wrong: ["הֵם שָׁבְרוּ אֶת הַשִּׂיא", "הֵם יִשְׁבְּרוּ הַשִּׂיא", "הֵם שְׁבוּרִים אֶת הַשִּׂיא"] },
    ],
  },
  {
    id: "root-lbsh-ahv", kind: "root", pattern: "paal", icon: "🌱", english: "Roots ל־ב־שׁ + א־ה־ב: wear & love", hebrew: "שָׁרָשִׁים ל־ב־שׁ + א־ה־ב: לִלְבֹּשׁ, לֶאֱהֹב",
    words: [
      { english: "to wear, to put on", hebrew: "לִלְבֹּשׁ", wrong: ["לוֹבֵשׁ", "לָבוּשׁ", "לְבוּשׁ"] },
      { english: "to love", hebrew: "לֶאֱהֹב", wrong: ["אוֹהֵב", "אָהוּב", "אַהֲבָה"] },
      { english: "she wears", hebrew: "הִיא לוֹבֶשֶׁת", wrong: ["הִיא לְבוּשָׁה", "הִיא לוֹבֵשׁ", "הִיא לָבְשָׁה"] },
      { english: "he loves", hebrew: "הוּא אוֹהֵב", wrong: ["הוּא אָהוּב", "הוּא אוֹהֶבֶת", "הוּא אָהַב"] },
      { english: "dressed (m.)", hebrew: "לָבוּשׁ", wrong: ["לוֹבֵשׁ", "לְבוּשָׁה", "לְבוּשׁ"] },
      { english: "dressed (f.)", hebrew: "לְבוּשָׁה", wrong: ["לוֹבֶשֶׁת", "לָבוּשׁ", "לָבְשָׁה"] },
      { english: "loved, favorite (m.)", hebrew: "אָהוּב", wrong: ["אוֹהֵב", "אֲהוּבָה", "אַהֲבָה"] },
      { english: "loved, favorite (f.)", hebrew: "אֲהוּבָה", wrong: ["אוֹהֶבֶת", "אָהוּב", "אַהֲבָה"] },
      { english: "clothing, an outfit", hebrew: "לְבוּשׁ", wrong: ["לָבוּשׁ", "לוֹבֵשׁ", "בְּגָדִים"] },
      { english: "love", hebrew: "אַהֲבָה", wrong: ["אֲהוּבָה", "אוֹהֶבֶת", "אָהוּב"] },
      { english: "she wears a dress", hebrew: "הִיא לוֹבֶשֶׁת שִׂמְלָה", wrong: ["הִיא לְבוּשָׁה שִׂמְלָה", "הִיא לוֹבֶשֶׁת אֶת שִׂמְלָה", "הִיא לוֹבֵשׁ שִׂמְלָה"] },
      { english: "he is dressed in black", hebrew: "הוּא לָבוּשׁ בְּשָׁחֹר", wrong: ["הוּא לוֹבֵשׁ בְּשָׁחֹר", "הוּא לְבוּשָׁה בְּשָׁחֹר", "הוּא לָבַשׁ בְּשָׁחֹר"] },
      { english: "she loves the song", hebrew: "הִיא אוֹהֶבֶת אֶת הַשִּׁיר", wrong: ["הִיא אֲהוּבָה אֶת הַשִּׁיר", "הִיא אוֹהֶבֶת הַשִּׁיר", "הִיא אוֹהֶבֶת לַשִּׁיר"] },
      { english: "the song is loved by everyone", hebrew: "הַשִּׁיר אָהוּב עַל כֻּלָּם", wrong: ["הַשִּׁיר אוֹהֵב אֶת כֻּלָּם", "הַשִּׁיר אֲהוּבָה עַל כֻּלָּם", "הַשִּׁיר אָהוּב לְכֻלָּם"] },
      { english: "my favorite teacher (f.)", hebrew: "הַמּוֹרָה הָאֲהוּבָה עָלַי", wrong: ["הַמּוֹרָה הָאוֹהֶבֶת עָלַי", "הַמּוֹרָה הָאָהוּב עָלַי", "הַמּוֹרָה הָאֲהוּבָה עָלָיו"] },
      // ----- More practice (2026-11-12) -----
      // ל־ב־שׁ: more present-tense forms
      { english: "he wears", hebrew: "הוּא לוֹבֵשׁ", wrong: ["הוּא לָבוּשׁ", "הוּא לוֹבֶשֶׁת", "הוּא לָבַשׁ"] },
      { english: "I wear", hebrew: "אֲנִי לוֹבֵשׁ", wrong: ["אֲנִי לָבוּשׁ", "אֲנִי לוֹבֶשֶׁת", "אֲנִי לָבַשְׁתִּי"], f: { hebrew: "אֲנִי לוֹבֶשֶׁת", wrong: ["אֲנִי לְבוּשָׁה", "אֲנִי לוֹבֵשׁ", "אֲנִי לָבַשְׁתִּי"] } },
      { english: "you (f.) wear", hebrew: "אַתְּ לוֹבֶשֶׁת", wrong: ["אַתְּ לוֹבֵשׁ", "אַתְּ לְבוּשָׁה", "אַתְּ לָבַשְׁתְּ"] },
      { english: "we wear", hebrew: "אֲנַחְנוּ לוֹבְשִׁים", wrong: ["אֲנַחְנוּ לְבוּשִׁים", "אֲנַחְנוּ לוֹבֵשׁ", "אֲנַחְנוּ לָבַשְׁנוּ"], f: { hebrew: "אֲנַחְנוּ לוֹבְשׁוֹת", wrong: ["אֲנַחְנוּ לְבוּשׁוֹת", "אֲנַחְנוּ לוֹבֶשֶׁת", "אֲנַחְנוּ לָבַשְׁנוּ"] } },
      { english: "they (m.) wear", hebrew: "הֵם לוֹבְשִׁים", wrong: ["הֵם לוֹבְשׁוֹת", "הֵם לְבוּשִׁים", "הֵם לָבְשׁוּ"] },
      // Getting dressed (same root)
      // Describing word: plural forms, with nouns that agree
      { english: "dressed (plural, m.)", hebrew: "לְבוּשִׁים", wrong: ["לְבוּשׁוֹת", "לוֹבְשִׁים", "לָבוּשׁ"] },
      { english: "dressed (plural, f.)", hebrew: "לְבוּשׁוֹת", wrong: ["לְבוּשִׁים", "לוֹבְשׁוֹת", "לְבוּשָׁה"] },
      { english: "the girls are dressed in white", hebrew: "הַבָּנוֹת לְבוּשׁוֹת בְּלָבָן", wrong: ["הַבָּנוֹת לְבוּשִׁים בְּלָבָן", "הַבָּנוֹת לוֹבְשׁוֹת בְּלָבָן", "הַבָּנוֹת לְבוּשָׁה בְּלָבָן"] },
      { english: "she is dressed in a red dress", hebrew: "הִיא לְבוּשָׁה בְּשִׂמְלָה אֲדֻמָּה", wrong: ["הִיא לוֹבֶשֶׁת בְּשִׂמְלָה אֲדֻמָּה", "הִיא לָבוּשׁ בְּשִׂמְלָה אֲדֻמָּה", "הִיא לְבוּשָׁה לְשִׂמְלָה אֲדֻמָּה"] },
      { english: "clothes, garments", hebrew: "מַלְבּוּשִׁים", wrong: ["מַלְבּוּשׁוֹת", "מַלְבּוּשׁ", "לוֹבְשִׁים"] },
      // Everyday sentences with clothes
      { english: "he wears a coat", hebrew: "הוּא לוֹבֵשׁ מְעִיל", wrong: ["הוּא לָבוּשׁ מְעִיל", "הוּא לוֹבֵשׁ אֶת מְעִיל", "הוּא לוֹבֶשֶׁת מְעִיל"] },
      { english: "I'm wearing the new shirt", hebrew: "אֲנִי לוֹבֵשׁ אֶת הַחֻלְצָה הַחֲדָשָׁה", wrong: ["אֲנִי לוֹבֵשׁ הַחֻלְצָה הַחֲדָשָׁה", "אֲנִי לָבוּשׁ אֶת הַחֻלְצָה הַחֲדָשָׁה", "אֲנִי לוֹבֵשׁ אֶת הַחֻלְצָה הֶחָדָשׁ"], f: { hebrew: "אֲנִי לוֹבֶשֶׁת אֶת הַחֻלְצָה הַחֲדָשָׁה", wrong: ["אֲנִי לוֹבֶשֶׁת הַחֻלְצָה הַחֲדָשָׁה", "אֲנִי לְבוּשָׁה אֶת הַחֻלְצָה הַחֲדָשָׁה", "אֲנִי לוֹבֵשׁ אֶת הַחֻלְצָה הַחֲדָשָׁה"] } },
      { english: "yesterday I wore a sweater", hebrew: "אֶתְמוֹל לָבַשְׁתִּי סְוֶדֶר", wrong: ["אֶתְמוֹל לָבַשְׁנוּ סְוֶדֶר", "אֶתְמוֹל אֶלְבַּשׁ סְוֶדֶר", "אֶתְמוֹל לָבוּשׁ סְוֶדֶר"] },
      { english: "tomorrow she will wear a skirt", hebrew: "מָחָר הִיא תִּלְבַּשׁ חֲצָאִית", wrong: ["מָחָר הִיא לָבְשָׁה חֲצָאִית", "מָחָר הִיא יִלְבַּשׁ חֲצָאִית", "מָחָר הִיא תִּלְבַּשׁ אֶת חֲצָאִית"] },
      { english: "what are you (m.) wearing to the party?", hebrew: "מָה אַתָּה לוֹבֵשׁ לַמְּסִבָּה?", wrong: ["מָה אַתָּה לוֹבֶשֶׁת לַמְּסִבָּה?", "מָה אַתָּה לָבוּשׁ לַמְּסִבָּה?", "מָה אַתָּה לוֹבֵשׁ אֶת הַמְּסִבָּה?"] },
      { english: "she wears it (the coat)", hebrew: "הִיא לוֹבֶשֶׁת אוֹתוֹ", wrong: ["הִיא לוֹבֶשֶׁת אוֹתָהּ", "הִיא לוֹבֶשֶׁת לוֹ", "הִיא לְבוּשָׁה אוֹתוֹ"] },
      { english: "he wears them (the pants)", hebrew: "הוּא לוֹבֵשׁ אוֹתָם", wrong: ["הוּא לוֹבֵשׁ אוֹתָן", "הוּא לוֹבֵשׁ לָהֶם", "הוּא לָבוּשׁ אוֹתָם"] },
      // א־ה־ב: more present-tense forms
      { english: "I love", hebrew: "אֲנִי אוֹהֵב", wrong: ["אֲנִי אָהוּב", "אֲנִי אוֹהֶבֶת", "אֲנִי אָהַבְתִּי"], f: { hebrew: "אֲנִי אוֹהֶבֶת", wrong: ["אֲנִי אֲהוּבָה", "אֲנִי אוֹהֵב", "אֲנִי אָהַבְתִּי"] } },
      { english: "she loves", hebrew: "הִיא אוֹהֶבֶת", wrong: ["הִיא אֲהוּבָה", "הִיא אוֹהֵב", "הִיא אָהֲבָה"] },
      { english: "we love", hebrew: "אֲנַחְנוּ אוֹהֲבִים", wrong: ["אֲנַחְנוּ אֲהוּבִים", "אֲנַחְנוּ אוֹהֵב", "אֲנַחְנוּ אָהַבְנוּ"], f: { hebrew: "אֲנַחְנוּ אוֹהֲבוֹת", wrong: ["אֲנַחְנוּ אֲהוּבוֹת", "אֲנַחְנוּ אוֹהֶבֶת", "אֲנַחְנוּ אָהַבְנוּ"] } },
      { english: "they (f.) love", hebrew: "הֵן אוֹהֲבוֹת", wrong: ["הֵן אוֹהֲבִים", "הֵן אֲהוּבוֹת", "הֵן אָהֲבוּ"] },
      // Describing words: plural forms, "in love"
      { english: "loved, favorite (plural, m.)", hebrew: "אֲהוּבִים", wrong: ["אֲהוּבוֹת", "אוֹהֲבִים", "אָהוּב"] },
      { english: "loved, favorite (plural, f.)", hebrew: "אֲהוּבוֹת", wrong: ["אֲהוּבִים", "אוֹהֲבוֹת", "אֲהוּבָה"] },
      { english: "in love (m.)", hebrew: "מְאֹהָב", wrong: ["אוֹהֵב", "מְאֹהֶבֶת", "אָהוּב"] },
      { english: "he is in love with her", hebrew: "הוּא מְאֹהָב בָּהּ", wrong: ["הוּא מְאֹהָב אוֹתָהּ", "הוּא מְאֹהֶבֶת בָּהּ", "הוּא מְאֹהָב בּוֹ"] },
      { english: "my favorite song", hebrew: "הַשִּׁיר הָאָהוּב עָלַי", wrong: ["הַשִּׁיר הָאֲהוּבָה עָלַי", "הַשִּׁיר הָאוֹהֵב עָלַי", "הַשִּׁיר אָהוּב עָלַי"] },
      { english: "my favorite books", hebrew: "הַסְּפָרִים הָאֲהוּבִים עָלַי", wrong: ["הַסְּפָרִים הָאֲהוּבוֹת עָלַי", "הַסְּפָרִים הָאוֹהֲבִים עָלַי", "הַסְּפָרִים הָאֲהוּבִים אוֹתִי"] },
      { english: "my favorite shirts", hebrew: "הַחֻלְצוֹת הָאֲהוּבוֹת עָלַי", wrong: ["הַחֻלְצוֹת הָאֲהוּבִים עָלַי", "הַחֻלְצוֹת הָאוֹהֲבוֹת עָלַי", "הַחֻלְצוֹת הָאֲהוּבָה עָלַי"] },
      { english: "the teachers (f.) are loved by the students", hebrew: "הַמּוֹרוֹת אֲהוּבוֹת עַל הַתַּלְמִידִים", wrong: ["הַמּוֹרוֹת אֲהוּבִים עַל הַתַּלְמִידִים", "הַמּוֹרוֹת אוֹהֲבוֹת אֶת הַתַּלְמִידִים", "הַמּוֹרוֹת אֲהוּבוֹת לַתַּלְמִידִים"] },
      { english: "first love", hebrew: "אַהֲבָה רִאשׁוֹנָה", wrong: ["אַהֲבָה רִאשׁוֹן", "אֲהוּבָה רִאשׁוֹנָה", "אַהֲבָה הָרִאשׁוֹנָה"] },
      // Everyday sentences: אֶת, object pronouns, past/future, שֶׁ
      { english: "I love to dance", hebrew: "אֲנִי אוֹהֵב לִרְקֹד", wrong: ["אֲנִי אוֹהֵב רוֹקֵד", "אֲנִי אוֹהֵב אֶת לִרְקֹד", "אֲנִי אָהוּב לִרְקֹד"], f: { hebrew: "אֲנִי אוֹהֶבֶת לִרְקֹד", wrong: ["אֲנִי אוֹהֶבֶת רוֹקֶדֶת", "אֲנִי אוֹהֵב לִרְקֹד", "אֲנִי אֲהוּבָה לִרְקֹד"] } },
      { english: "he loves her", hebrew: "הוּא אוֹהֵב אוֹתָהּ", wrong: ["הוּא אוֹהֵב אוֹתוֹ", "הוּא אוֹהֵב לָהּ", "הוּא אוֹהֵב בָּהּ"] },
      { english: "my grandma loves me", hebrew: "סַבְתָּא שֶׁלִּי אוֹהֶבֶת אוֹתִי", wrong: ["סַבְתָּא שֶׁלִּי אוֹהֵב אוֹתִי", "סַבְתָּא שֶׁלִּי אוֹהֶבֶת לִי", "סַבְתָּא שֶׁלִּי אֲהוּבָה אוֹתִי"] },
      { english: "she loved the movie", hebrew: "הִיא אָהֲבָה אֶת הַסֶּרֶט", wrong: ["הִיא אָהַב אֶת הַסֶּרֶט", "הִיא אָהֲבָה הַסֶּרֶט", "הִיא אֲהוּבָה אֶת הַסֶּרֶט"] },
      { english: "we loved the trip", hebrew: "אָהַבְנוּ אֶת הַטִּיּוּל", wrong: ["אָהַבְנוּ הַטִּיּוּל", "אָהַבְתִּי אֶת הַטִּיּוּל", "אֲהוּבִים אֶת הַטִּיּוּל"] },
      { english: "he will love the present", hebrew: "הוּא יֹאהַב אֶת הַמַּתָּנָה", wrong: ["הוּא אָהַב אֶת הַמַּתָּנָה", "הוּא תֹּאהַב אֶת הַמַּתָּנָה", "הוּא יֹאהַב הַמַּתָּנָה"] },
      { english: "the food that she loves", hebrew: "הָאֹכֶל שֶׁהִיא אוֹהֶבֶת", wrong: ["הָאֹכֶל שֶׁהִיא אוֹהֵב", "הָאֹכֶל שֶׁהִיא אֲהוּבָה", "הָאֹכֶל שֶׁהוּא אוֹהֶבֶת"] },
    ],
  },

  // ===== Conjugation decks: one verb in the past and future =====
  // Wrong answers: the same person in the other tense, the other gender (or I <-> we), and another person.
  {
    id: "conj-ktv", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate כ־ת־ב: wrote / will write", hebrew: "כ־ת־ב: לִכְתֹּב",
    words: [
      { english: "I wrote", hint: "לִכְתֹּב", hebrew: "אֲנִי כָּתַבְתִּי", wrong: ["אֲנִי אֶכְתֹּב", "אֲנִי כָּתַבְנוּ", "אֲנִי כָּתַב"] },
      { english: "you (m.) wrote", hint: "לִכְתֹּב", hebrew: "אַתָּה כָּתַבְתָּ", wrong: ["אַתָּה תִּכְתֹּב", "אַתָּה כָּתַבְתְּ", "אַתָּה כָּתַבְתִּי"] },
      { english: "you (f.) wrote", hint: "לִכְתֹּב", hebrew: "אַתְּ כָּתַבְתְּ", wrong: ["אַתְּ תִּכְתְּבִי", "אַתְּ כָּתַבְתָּ", "אַתְּ כָּתַבְנוּ"] },
      { english: "he wrote", hint: "לִכְתֹּב", hebrew: "הוּא כָּתַב", wrong: ["הוּא יִכְתֹּב", "הוּא כָּתְבָה", "הוּא כָּתַבְתִּי"] },
      { english: "she wrote", hint: "לִכְתֹּב", hebrew: "הִיא כָּתְבָה", wrong: ["הִיא תִּכְתֹּב", "הִיא כָּתַב", "הִיא כָּתַבְתְּ"] },
      { english: "we wrote", hint: "לִכְתֹּב", hebrew: "אֲנַחְנוּ כָּתַבְנוּ", wrong: ["אֲנַחְנוּ נִכְתֹּב", "אֲנַחְנוּ כָּתַבְתִּי", "אֲנַחְנוּ כָּתְבוּ"] },
      { english: "you all (m.) wrote", hint: "לִכְתֹּב", hebrew: "אַתֶּם כְּתַבְתֶּם", wrong: ["אַתֶּם תִּכְתְּבוּ", "אַתֶּם כָּתְבוּ", "אַתֶּם כָּתַבְתָּ"] },
      { english: "they wrote", hint: "לִכְתֹּב", hebrew: "הֵם כָּתְבוּ", wrong: ["הֵם יִכְתְּבוּ", "הֵם כְּתַבְתֶּם", "הֵם כָּתַב"] },
      { english: "I will write", hint: "לִכְתֹּב", hebrew: "אֲנִי אֶכְתֹּב", wrong: ["אֲנִי כָּתַבְתִּי", "אֲנִי נִכְתֹּב", "אֲנִי יִכְתֹּב"] },
      { english: "you (m.) will write", hint: "לִכְתֹּב", hebrew: "אַתָּה תִּכְתֹּב", wrong: ["אַתָּה כָּתַבְתָּ", "אַתָּה תִּכְתְּבִי", "אַתָּה אֶכְתֹּב"] },
      { english: "you (f.) will write", hint: "לִכְתֹּב", hebrew: "אַתְּ תִּכְתְּבִי", wrong: ["אַתְּ כָּתַבְתְּ", "אַתְּ תִּכְתֹּב", "אַתְּ נִכְתֹּב"] },
      { english: "he will write", hint: "לִכְתֹּב", hebrew: "הוּא יִכְתֹּב", wrong: ["הוּא כָּתַב", "הוּא תִּכְתֹּב", "הוּא אֶכְתֹּב"] },
      { english: "she will write", hint: "לִכְתֹּב", hebrew: "הִיא תִּכְתֹּב", wrong: ["הִיא כָּתְבָה", "הִיא יִכְתֹּב", "הִיא תִּכְתְּבִי"] },
      { english: "we will write", hint: "לִכְתֹּב", hebrew: "אֲנַחְנוּ נִכְתֹּב", wrong: ["אֲנַחְנוּ כָּתַבְנוּ", "אֲנַחְנוּ אֶכְתֹּב", "אֲנַחְנוּ יִכְתְּבוּ"] },
      { english: "you all (m.) will write", hint: "לִכְתֹּב", hebrew: "אַתֶּם תִּכְתְּבוּ", wrong: ["אַתֶּם כְּתַבְתֶּם", "אַתֶּם יִכְתְּבוּ", "אַתֶּם תִּכְתֹּב"] },
      { english: "they will write", hint: "לִכְתֹּב", hebrew: "הֵם יִכְתְּבוּ", wrong: ["הֵם כָּתְבוּ", "הֵם תִּכְתְּבוּ", "הֵם יִכְתֹּב"] },
      { english: "yesterday I wrote a letter to Dana", hint: "לִכְתֹּב", hebrew: "אֶתְמוֹל כָּתַבְתִּי מִכְתָּב לְדָנָה", wrong: ["אֶתְמוֹל אֶכְתֹּב מִכְתָּב לְדָנָה", "אֶתְמוֹל כָּתַבְתִּי מִכְתָּב עַל דָּנָה", "אֶתְמוֹל כָּתַבְנוּ מִכְתָּב לְדָנָה"] },
      { english: "tomorrow she will write about the trip", hint: "לִכְתֹּב", hebrew: "מָחָר הִיא תִּכְתֹּב עַל הַטִּיּוּל", wrong: ["מָחָר הִיא כָּתְבָה עַל הַטִּיּוּל", "מָחָר הִיא תִּכְתֹּב לַטִּיּוּל", "מָחָר הִיא יִכְתֹּב עַל הַטִּיּוּל"] },
    ],
  },
  {
    id: "conj-lmd", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate ל־מ־ד: learned / will learn", hebrew: "ל־מ־ד: לִלְמֹד",
    words: [
      { english: "I learned", hint: "לִלְמֹד", hebrew: "אֲנִי לָמַדְתִּי", wrong: ["אֲנִי אֶלְמַד", "אֲנִי לָמַדְנוּ", "אֲנִי לָמַד"] },
      { english: "you (m.) learned", hint: "לִלְמֹד", hebrew: "אַתָּה לָמַדְתָּ", wrong: ["אַתָּה תִּלְמַד", "אַתָּה לָמַדְתְּ", "אַתָּה לָמַדְתִּי"] },
      { english: "you (f.) learned", hint: "לִלְמֹד", hebrew: "אַתְּ לָמַדְתְּ", wrong: ["אַתְּ תִּלְמְדִי", "אַתְּ לָמַדְתָּ", "אַתְּ לָמַדְנוּ"] },
      { english: "he learned", hint: "לִלְמֹד", hebrew: "הוּא לָמַד", wrong: ["הוּא יִלְמַד", "הוּא לָמְדָה", "הוּא לָמַדְתִּי"] },
      { english: "she learned", hint: "לִלְמֹד", hebrew: "הִיא לָמְדָה", wrong: ["הִיא תִּלְמַד", "הִיא לָמַד", "הִיא לָמַדְתְּ"] },
      { english: "we learned", hint: "לִלְמֹד", hebrew: "אֲנַחְנוּ לָמַדְנוּ", wrong: ["אֲנַחְנוּ נִלְמַד", "אֲנַחְנוּ לָמַדְתִּי", "אֲנַחְנוּ לָמְדוּ"] },
      { english: "you all (m.) learned", hint: "לִלְמֹד", hebrew: "אַתֶּם לְמַדְתֶּם", wrong: ["אַתֶּם תִּלְמְדוּ", "אַתֶּם לָמְדוּ", "אַתֶּם לָמַדְתָּ"] },
      { english: "they learned", hint: "לִלְמֹד", hebrew: "הֵם לָמְדוּ", wrong: ["הֵם יִלְמְדוּ", "הֵם לְמַדְתֶּם", "הֵם לָמַד"] },
      { english: "I will learn", hint: "לִלְמֹד", hebrew: "אֲנִי אֶלְמַד", wrong: ["אֲנִי לָמַדְתִּי", "אֲנִי נִלְמַד", "אֲנִי יִלְמַד"] },
      { english: "you (m.) will learn", hint: "לִלְמֹד", hebrew: "אַתָּה תִּלְמַד", wrong: ["אַתָּה לָמַדְתָּ", "אַתָּה תִּלְמְדִי", "אַתָּה אֶלְמַד"] },
      { english: "you (f.) will learn", hint: "לִלְמֹד", hebrew: "אַתְּ תִּלְמְדִי", wrong: ["אַתְּ לָמַדְתְּ", "אַתְּ תִּלְמַד", "אַתְּ נִלְמַד"] },
      { english: "he will learn", hint: "לִלְמֹד", hebrew: "הוּא יִלְמַד", wrong: ["הוּא לָמַד", "הוּא תִּלְמַד", "הוּא אֶלְמַד"] },
      { english: "she will learn", hint: "לִלְמֹד", hebrew: "הִיא תִּלְמַד", wrong: ["הִיא לָמְדָה", "הִיא יִלְמַד", "הִיא תִּלְמְדִי"] },
      { english: "we will learn", hint: "לִלְמֹד", hebrew: "אֲנַחְנוּ נִלְמַד", wrong: ["אֲנַחְנוּ לָמַדְנוּ", "אֲנַחְנוּ אֶלְמַד", "אֲנַחְנוּ יִלְמְדוּ"] },
      { english: "you all (m.) will learn", hint: "לִלְמֹד", hebrew: "אַתֶּם תִּלְמְדוּ", wrong: ["אַתֶּם לְמַדְתֶּם", "אַתֶּם יִלְמְדוּ", "אַתֶּם תִּלְמַד"] },
      { english: "they will learn", hint: "לִלְמֹד", hebrew: "הֵם יִלְמְדוּ", wrong: ["הֵם לָמְדוּ", "הֵם תִּלְמְדוּ", "הֵם יִלְמַד"] },
      { english: "last year we learned in Israel", hint: "לִלְמֹד", hebrew: "בַּשָּׁנָה שֶׁעָבְרָה לָמַדְנוּ בְּיִשְׂרָאֵל", wrong: ["בַּשָּׁנָה שֶׁעָבְרָה נִלְמַד בְּיִשְׂרָאֵל", "בַּשָּׁנָה שֶׁעָבְרָה לָמַדְנוּ עַל יִשְׂרָאֵל", "בַּשָּׁנָה שֶׁעָבְרָה לָמַדְתִּי בְּיִשְׂרָאֵל"] },
      { english: "tomorrow they will learn about Jerusalem", hint: "לִלְמֹד", hebrew: "מָחָר הֵם יִלְמְדוּ עַל יְרוּשָׁלַיִם", wrong: ["מָחָר הֵם לָמְדוּ עַל יְרוּשָׁלַיִם", "מָחָר הֵם יִלְמְדוּ בִּירוּשָׁלַיִם", "מָחָר הֵם נִלְמַד עַל יְרוּשָׁלַיִם"] },
    ],
  },
  {
    id: "conj-avd", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate ע־ב־ד: worked / will work", hebrew: "ע־ב־ד: לַעֲבֹד",
    words: [
      { english: "I worked", hint: "לַעֲבֹד", hebrew: "אֲנִי עָבַדְתִּי", wrong: ["אֲנִי אֶעֱבֹד", "אֲנִי עָבַדְנוּ", "אֲנִי עָבַד"] },
      { english: "you (m.) worked", hint: "לַעֲבֹד", hebrew: "אַתָּה עָבַדְתָּ", wrong: ["אַתָּה תַּעֲבֹד", "אַתָּה עָבַדְתְּ", "אַתָּה עָבַדְתִּי"] },
      { english: "you (f.) worked", hint: "לַעֲבֹד", hebrew: "אַתְּ עָבַדְתְּ", wrong: ["אַתְּ תַּעַבְדִי", "אַתְּ עָבַדְתָּ", "אַתְּ עָבַדְנוּ"] },
      { english: "he worked", hint: "לַעֲבֹד", hebrew: "הוּא עָבַד", wrong: ["הוּא יַעֲבֹד", "הוּא עָבְדָה", "הוּא עָבַדְתִּי"] },
      { english: "she worked", hint: "לַעֲבֹד", hebrew: "הִיא עָבְדָה", wrong: ["הִיא תַּעֲבֹד", "הִיא עָבַד", "הִיא עָבַדְתְּ"] },
      { english: "we worked", hint: "לַעֲבֹד", hebrew: "אֲנַחְנוּ עָבַדְנוּ", wrong: ["אֲנַחְנוּ נַעֲבֹד", "אֲנַחְנוּ עָבַדְתִּי", "אֲנַחְנוּ עָבְדוּ"] },
      { english: "you all (m.) worked", hint: "לַעֲבֹד", hebrew: "אַתֶּם עֲבַדְתֶּם", wrong: ["אַתֶּם תַּעַבְדוּ", "אַתֶּם עָבְדוּ", "אַתֶּם עָבַדְתָּ"] },
      { english: "they worked", hint: "לַעֲבֹד", hebrew: "הֵם עָבְדוּ", wrong: ["הֵם יַעַבְדוּ", "הֵם עֲבַדְתֶּם", "הֵם עָבַד"] },
      { english: "I will work", hint: "לַעֲבֹד", hebrew: "אֲנִי אֶעֱבֹד", wrong: ["אֲנִי עָבַדְתִּי", "אֲנִי נַעֲבֹד", "אֲנִי יַעֲבֹד"] },
      { english: "you (m.) will work", hint: "לַעֲבֹד", hebrew: "אַתָּה תַּעֲבֹד", wrong: ["אַתָּה עָבַדְתָּ", "אַתָּה תַּעַבְדִי", "אַתָּה אֶעֱבֹד"] },
      { english: "you (f.) will work", hint: "לַעֲבֹד", hebrew: "אַתְּ תַּעַבְדִי", wrong: ["אַתְּ עָבַדְתְּ", "אַתְּ תַּעֲבֹד", "אַתְּ נַעֲבֹד"] },
      { english: "he will work", hint: "לַעֲבֹד", hebrew: "הוּא יַעֲבֹד", wrong: ["הוּא עָבַד", "הוּא תַּעֲבֹד", "הוּא אֶעֱבֹד"] },
      { english: "she will work", hint: "לַעֲבֹד", hebrew: "הִיא תַּעֲבֹד", wrong: ["הִיא עָבְדָה", "הִיא יַעֲבֹד", "הִיא תַּעַבְדִי"] },
      { english: "we will work", hint: "לַעֲבֹד", hebrew: "אֲנַחְנוּ נַעֲבֹד", wrong: ["אֲנַחְנוּ עָבַדְנוּ", "אֲנַחְנוּ אֶעֱבֹד", "אֲנַחְנוּ יַעַבְדוּ"] },
      { english: "you all (m.) will work", hint: "לַעֲבֹד", hebrew: "אַתֶּם תַּעַבְדוּ", wrong: ["אַתֶּם עֲבַדְתֶּם", "אַתֶּם יַעַבְדוּ", "אַתֶּם תַּעֲבֹד"] },
      { english: "they will work", hint: "לַעֲבֹד", hebrew: "הֵם יַעַבְדוּ", wrong: ["הֵם עָבְדוּ", "הֵם תַּעַבְדוּ", "הֵם יַעֲבֹד"] },
      { english: "yesterday he worked at the bank", hint: "לַעֲבֹד", hebrew: "אֶתְמוֹל הוּא עָבַד בַּבַּנְק", wrong: ["אֶתְמוֹל הוּא יַעֲבֹד בַּבַּנְק", "אֶתְמוֹל הוּא עָבַד מֵהַבַּנְק", "אֶתְמוֹל הוּא עָבְדָה בַּבַּנְק"] },
      { english: "tomorrow we will work on the project", hint: "לַעֲבֹד", hebrew: "מָחָר נַעֲבֹד עַל הַפְּרוֹיֶקְט", wrong: ["מָחָר עָבַדְנוּ עַל הַפְּרוֹיֶקְט", "מָחָר נַעֲבֹד לַפְּרוֹיֶקְט", "מָחָר אֶעֱבֹד עַל הַפְּרוֹיֶקְט"] },
    ],
  },
  {
    id: "conj-akl", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate א־כ־ל: ate / will eat", hebrew: "א־כ־ל: לֶאֱכֹל",
    words: [
      { english: "I ate", hint: "לֶאֱכֹל", hebrew: "אֲנִי אָכַלְתִּי", wrong: ["אֲנִי אֹכַל", "אֲנִי אָכַלְנוּ", "אֲנִי אָכַל"] },
      { english: "you (m.) ate", hint: "לֶאֱכֹל", hebrew: "אַתָּה אָכַלְתָּ", wrong: ["אַתָּה תֹּאכַל", "אַתָּה אָכַלְתְּ", "אַתָּה אָכַלְתִּי"] },
      { english: "you (f.) ate", hint: "לֶאֱכֹל", hebrew: "אַתְּ אָכַלְתְּ", wrong: ["אַתְּ תֹּאכְלִי", "אַתְּ אָכַלְתָּ", "אַתְּ אָכַלְנוּ"] },
      { english: "he ate", hint: "לֶאֱכֹל", hebrew: "הוּא אָכַל", wrong: ["הוּא יֹאכַל", "הוּא אָכְלָה", "הוּא אָכַלְתִּי"] },
      { english: "she ate", hint: "לֶאֱכֹל", hebrew: "הִיא אָכְלָה", wrong: ["הִיא תֹּאכַל", "הִיא אָכַל", "הִיא אָכַלְתְּ"] },
      { english: "we ate", hint: "לֶאֱכֹל", hebrew: "אֲנַחְנוּ אָכַלְנוּ", wrong: ["אֲנַחְנוּ נֹאכַל", "אֲנַחְנוּ אָכַלְתִּי", "אֲנַחְנוּ אָכְלוּ"] },
      { english: "you all (m.) ate", hint: "לֶאֱכֹל", hebrew: "אַתֶּם אֲכַלְתֶּם", wrong: ["אַתֶּם תֹּאכְלוּ", "אַתֶּם אָכְלוּ", "אַתֶּם אָכַלְתָּ"] },
      { english: "they ate", hint: "לֶאֱכֹל", hebrew: "הֵם אָכְלוּ", wrong: ["הֵם יֹאכְלוּ", "הֵם אֲכַלְתֶּם", "הֵם אָכַל"] },
      { english: "I will eat", hint: "לֶאֱכֹל", hebrew: "אֲנִי אֹכַל", wrong: ["אֲנִי אָכַלְתִּי", "אֲנִי נֹאכַל", "אֲנִי יֹאכַל"] },
      { english: "you (m.) will eat", hint: "לֶאֱכֹל", hebrew: "אַתָּה תֹּאכַל", wrong: ["אַתָּה אָכַלְתָּ", "אַתָּה תֹּאכְלִי", "אַתָּה אֹכַל"] },
      { english: "you (f.) will eat", hint: "לֶאֱכֹל", hebrew: "אַתְּ תֹּאכְלִי", wrong: ["אַתְּ אָכַלְתְּ", "אַתְּ תֹּאכַל", "אַתְּ נֹאכַל"] },
      { english: "he will eat", hint: "לֶאֱכֹל", hebrew: "הוּא יֹאכַל", wrong: ["הוּא אָכַל", "הוּא תֹּאכַל", "הוּא אֹכַל"] },
      { english: "she will eat", hint: "לֶאֱכֹל", hebrew: "הִיא תֹּאכַל", wrong: ["הִיא אָכְלָה", "הִיא יֹאכַל", "הִיא תֹּאכְלִי"] },
      { english: "we will eat", hint: "לֶאֱכֹל", hebrew: "אֲנַחְנוּ נֹאכַל", wrong: ["אֲנַחְנוּ אָכַלְנוּ", "אֲנַחְנוּ אֹכַל", "אֲנַחְנוּ יֹאכְלוּ"] },
      { english: "you all (m.) will eat", hint: "לֶאֱכֹל", hebrew: "אַתֶּם תֹּאכְלוּ", wrong: ["אַתֶּם אֲכַלְתֶּם", "אַתֶּם יֹאכְלוּ", "אַתֶּם תֹּאכַל"] },
      { english: "they will eat", hint: "לֶאֱכֹל", hebrew: "הֵם יֹאכְלוּ", wrong: ["הֵם אָכְלוּ", "הֵם תֹּאכְלוּ", "הֵם יֹאכַל"] },
      { english: "yesterday we ate at a restaurant", hint: "לֶאֱכֹל", hebrew: "אֶתְמוֹל אָכַלְנוּ בְּמִסְעָדָה", wrong: ["אֶתְמוֹל נֹאכַל בְּמִסְעָדָה", "אֶתְמוֹל אָכַלְנוּ לְמִסְעָדָה", "אֶתְמוֹל אָכַלְתִּי בְּמִסְעָדָה"] },
      { english: "tonight she will eat with her friends", hint: "לֶאֱכֹל", hebrew: "הָעֶרֶב הִיא תֹּאכַל עִם הַחֲבֵרוֹת שֶׁלָּהּ", wrong: ["הָעֶרֶב הִיא אָכְלָה עִם הַחֲבֵרוֹת שֶׁלָּהּ", "הָעֶרֶב הִיא תֹּאכַל אֶת הַחֲבֵרוֹת שֶׁלָּהּ", "הָעֶרֶב הִיא יֹאכַל עִם הַחֲבֵרוֹת שֶׁלָּהּ"] },
    ],
  },
  {
    id: "conj-sht", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate ש־ת־ה: drank / will drink", hebrew: "ש־ת־ה: לִשְׁתּוֹת",
    words: [
      { english: "I drank", hint: "לִשְׁתּוֹת", hebrew: "אֲנִי שָׁתִיתִי", wrong: ["אֲנִי אֶשְׁתֶּה", "אֲנִי שָׁתִינוּ", "אֲנִי שָׁתָה"] },
      { english: "you (m.) drank", hint: "לִשְׁתּוֹת", hebrew: "אַתָּה שָׁתִיתָ", wrong: ["אַתָּה תִּשְׁתֶּה", "אַתָּה שָׁתִית", "אַתָּה שָׁתִיתִי"] },
      { english: "you (f.) drank", hint: "לִשְׁתּוֹת", hebrew: "אַתְּ שָׁתִית", wrong: ["אַתְּ תִּשְׁתִּי", "אַתְּ שָׁתִיתָ", "אַתְּ שָׁתִינוּ"] },
      { english: "he drank", hint: "לִשְׁתּוֹת", hebrew: "הוּא שָׁתָה", wrong: ["הוּא יִשְׁתֶּה", "הוּא שָׁתְתָה", "הוּא שָׁתִיתִי"] },
      { english: "she drank", hint: "לִשְׁתּוֹת", hebrew: "הִיא שָׁתְתָה", wrong: ["הִיא תִּשְׁתֶּה", "הִיא שָׁתָה", "הִיא שָׁתִית"] },
      { english: "we drank", hint: "לִשְׁתּוֹת", hebrew: "אֲנַחְנוּ שָׁתִינוּ", wrong: ["אֲנַחְנוּ נִשְׁתֶּה", "אֲנַחְנוּ שָׁתִיתִי", "אֲנַחְנוּ שָׁתוּ"] },
      { english: "you all (m.) drank", hint: "לִשְׁתּוֹת", hebrew: "אַתֶּם שְׁתִיתֶם", wrong: ["אַתֶּם תִּשְׁתּוּ", "אַתֶּם שָׁתוּ", "אַתֶּם שָׁתִיתָ"] },
      { english: "they drank", hint: "לִשְׁתּוֹת", hebrew: "הֵם שָׁתוּ", wrong: ["הֵם יִשְׁתּוּ", "הֵם שְׁתִיתֶם", "הֵם שָׁתָה"] },
      { english: "I will drink", hint: "לִשְׁתּוֹת", hebrew: "אֲנִי אֶשְׁתֶּה", wrong: ["אֲנִי שָׁתִיתִי", "אֲנִי נִשְׁתֶּה", "אֲנִי יִשְׁתֶּה"] },
      { english: "you (m.) will drink", hint: "לִשְׁתּוֹת", hebrew: "אַתָּה תִּשְׁתֶּה", wrong: ["אַתָּה שָׁתִיתָ", "אַתָּה תִּשְׁתִּי", "אַתָּה אֶשְׁתֶּה"] },
      { english: "you (f.) will drink", hint: "לִשְׁתּוֹת", hebrew: "אַתְּ תִּשְׁתִּי", wrong: ["אַתְּ שָׁתִית", "אַתְּ תִּשְׁתֶּה", "אַתְּ נִשְׁתֶּה"] },
      { english: "he will drink", hint: "לִשְׁתּוֹת", hebrew: "הוּא יִשְׁתֶּה", wrong: ["הוּא שָׁתָה", "הוּא תִּשְׁתֶּה", "הוּא אֶשְׁתֶּה"] },
      { english: "she will drink", hint: "לִשְׁתּוֹת", hebrew: "הִיא תִּשְׁתֶּה", wrong: ["הִיא שָׁתְתָה", "הִיא יִשְׁתֶּה", "הִיא תִּשְׁתִּי"] },
      { english: "we will drink", hint: "לִשְׁתּוֹת", hebrew: "אֲנַחְנוּ נִשְׁתֶּה", wrong: ["אֲנַחְנוּ שָׁתִינוּ", "אֲנַחְנוּ אֶשְׁתֶּה", "אֲנַחְנוּ יִשְׁתּוּ"] },
      { english: "you all (m.) will drink", hint: "לִשְׁתּוֹת", hebrew: "אַתֶּם תִּשְׁתּוּ", wrong: ["אַתֶּם שְׁתִיתֶם", "אַתֶּם יִשְׁתּוּ", "אַתֶּם תִּשְׁתֶּה"] },
      { english: "they will drink", hint: "לִשְׁתּוֹת", hebrew: "הֵם יִשְׁתּוּ", wrong: ["הֵם שָׁתוּ", "הֵם תִּשְׁתּוּ", "הֵם יִשְׁתֶּה"] },
      { english: "he drank from the bottle", hint: "לִשְׁתּוֹת", hebrew: "הוּא שָׁתָה מֵהַבַּקְבּוּק", wrong: ["הוּא יִשְׁתֶּה מֵהַבַּקְבּוּק", "הוּא שָׁתָה לַבַּקְבּוּק", "הוּא שָׁתְתָה מֵהַבַּקְבּוּק"] },
      { english: "on the trip you all (m.) will drink a lot of water", hint: "לִשְׁתּוֹת", hebrew: "בַּטִּיּוּל תִּשְׁתּוּ הַרְבֵּה מַיִם", wrong: ["בַּטִּיּוּל שְׁתִיתֶם הַרְבֵּה מַיִם", "בַּטִּיּוּל יִשְׁתּוּ הַרְבֵּה מַיִם", "בַּטִּיּוּל תִּשְׁתֶּה הַרְבֵּה מַיִם"] },
    ],
  },
  {
    id: "conj-dbr", kind: "conj", pattern: "piel", icon: "🔁", english: "Conjugate ד־ב־ר: spoke / will speak", hebrew: "ד־ב־ר: לְדַבֵּר",
    words: [
      { english: "I spoke", hint: "לְדַבֵּר", hebrew: "אֲנִי דִּבַּרְתִּי", wrong: ["אֲנִי אֲדַבֵּר", "אֲנִי דִּבַּרְנוּ", "אֲנִי דִּבֵּר"] },
      { english: "you (m.) spoke", hint: "לְדַבֵּר", hebrew: "אַתָּה דִּבַּרְתָּ", wrong: ["אַתָּה תְּדַבֵּר", "אַתָּה דִּבַּרְתְּ", "אַתָּה דִּבַּרְתִּי"] },
      { english: "you (f.) spoke", hint: "לְדַבֵּר", hebrew: "אַתְּ דִּבַּרְתְּ", wrong: ["אַתְּ תְּדַבְּרִי", "אַתְּ דִּבַּרְתָּ", "אַתְּ דִּבַּרְנוּ"] },
      { english: "he spoke", hint: "לְדַבֵּר", hebrew: "הוּא דִּבֵּר", wrong: ["הוּא יְדַבֵּר", "הוּא דִּבְּרָה", "הוּא דִּבַּרְתִּי"] },
      { english: "she spoke", hint: "לְדַבֵּר", hebrew: "הִיא דִּבְּרָה", wrong: ["הִיא תְּדַבֵּר", "הִיא דִּבֵּר", "הִיא דִּבַּרְתְּ"] },
      { english: "we spoke", hint: "לְדַבֵּר", hebrew: "אֲנַחְנוּ דִּבַּרְנוּ", wrong: ["אֲנַחְנוּ נְדַבֵּר", "אֲנַחְנוּ דִּבַּרְתִּי", "אֲנַחְנוּ דִּבְּרוּ"] },
      { english: "you all (m.) spoke", hint: "לְדַבֵּר", hebrew: "אַתֶּם דִּבַּרְתֶּם", wrong: ["אַתֶּם תְּדַבְּרוּ", "אַתֶּם דִּבְּרוּ", "אַתֶּם דִּבַּרְתָּ"] },
      { english: "they spoke", hint: "לְדַבֵּר", hebrew: "הֵם דִּבְּרוּ", wrong: ["הֵם יְדַבְּרוּ", "הֵם דִּבַּרְתֶּם", "הֵם דִּבֵּר"] },
      { english: "I will speak", hint: "לְדַבֵּר", hebrew: "אֲנִי אֲדַבֵּר", wrong: ["אֲנִי דִּבַּרְתִּי", "אֲנִי נְדַבֵּר", "אֲנִי יְדַבֵּר"] },
      { english: "you (m.) will speak", hint: "לְדַבֵּר", hebrew: "אַתָּה תְּדַבֵּר", wrong: ["אַתָּה דִּבַּרְתָּ", "אַתָּה תְּדַבְּרִי", "אַתָּה אֲדַבֵּר"] },
      { english: "you (f.) will speak", hint: "לְדַבֵּר", hebrew: "אַתְּ תְּדַבְּרִי", wrong: ["אַתְּ דִּבַּרְתְּ", "אַתְּ תְּדַבֵּר", "אַתְּ נְדַבֵּר"] },
      { english: "he will speak", hint: "לְדַבֵּר", hebrew: "הוּא יְדַבֵּר", wrong: ["הוּא דִּבֵּר", "הוּא תְּדַבֵּר", "הוּא אֲדַבֵּר"] },
      { english: "she will speak", hint: "לְדַבֵּר", hebrew: "הִיא תְּדַבֵּר", wrong: ["הִיא דִּבְּרָה", "הִיא יְדַבֵּר", "הִיא תְּדַבְּרִי"] },
      { english: "we will speak", hint: "לְדַבֵּר", hebrew: "אֲנַחְנוּ נְדַבֵּר", wrong: ["אֲנַחְנוּ דִּבַּרְנוּ", "אֲנַחְנוּ אֲדַבֵּר", "אֲנַחְנוּ יְדַבְּרוּ"] },
      { english: "you all (m.) will speak", hint: "לְדַבֵּר", hebrew: "אַתֶּם תְּדַבְּרוּ", wrong: ["אַתֶּם דִּבַּרְתֶּם", "אַתֶּם יְדַבְּרוּ", "אַתֶּם תְּדַבֵּר"] },
      { english: "they will speak", hint: "לְדַבֵּר", hebrew: "הֵם יְדַבְּרוּ", wrong: ["הֵם דִּבְּרוּ", "הֵם תְּדַבְּרוּ", "הֵם יְדַבֵּר"] },
      { english: "yesterday I talked with Dana", hint: "לְדַבֵּר", hebrew: "אֶתְמוֹל דִּבַּרְתִּי עִם דָּנָה", wrong: ["אֶתְמוֹל אֲדַבֵּר עִם דָּנָה", "אֶתְמוֹל דִּבַּרְתִּי עַל דָּנָה", "אֶתְמוֹל דִּבַּרְנוּ עִם דָּנָה"] },
      { english: "tomorrow the teacher (f.) will talk about the test", hint: "לְדַבֵּר", hebrew: "מָחָר הַמּוֹרָה תְּדַבֵּר עַל הַמִּבְחָן", wrong: ["מָחָר הַמּוֹרָה דִּבְּרָה עַל הַמִּבְחָן", "מָחָר הַמּוֹרָה תְּדַבֵּר עִם הַמִּבְחָן", "מָחָר הַמּוֹרָה יְדַבֵּר עַל הַמִּבְחָן"] },
    ],
  },
  {
    id: "conj-spr", kind: "conj", pattern: "piel", icon: "🔁", english: "Conjugate ס־פ־ר: told / will tell", hebrew: "ס־פ־ר: לְסַפֵּר",
    words: [
      { english: "I told", hint: "לְסַפֵּר", hebrew: "אֲנִי סִפַּרְתִּי", wrong: ["אֲנִי אֲסַפֵּר", "אֲנִי סִפַּרְנוּ", "אֲנִי סִפֵּר"] },
      { english: "you (m.) told", hint: "לְסַפֵּר", hebrew: "אַתָּה סִפַּרְתָּ", wrong: ["אַתָּה תְּסַפֵּר", "אַתָּה סִפַּרְתְּ", "אַתָּה סִפַּרְתִּי"] },
      { english: "you (f.) told", hint: "לְסַפֵּר", hebrew: "אַתְּ סִפַּרְתְּ", wrong: ["אַתְּ תְּסַפְּרִי", "אַתְּ סִפַּרְתָּ", "אַתְּ סִפַּרְנוּ"] },
      { english: "he told", hint: "לְסַפֵּר", hebrew: "הוּא סִפֵּר", wrong: ["הוּא יְסַפֵּר", "הוּא סִפְּרָה", "הוּא סִפַּרְתִּי"] },
      { english: "she told", hint: "לְסַפֵּר", hebrew: "הִיא סִפְּרָה", wrong: ["הִיא תְּסַפֵּר", "הִיא סִפֵּר", "הִיא סִפַּרְתְּ"] },
      { english: "we told", hint: "לְסַפֵּר", hebrew: "אֲנַחְנוּ סִפַּרְנוּ", wrong: ["אֲנַחְנוּ נְסַפֵּר", "אֲנַחְנוּ סִפַּרְתִּי", "אֲנַחְנוּ סִפְּרוּ"] },
      { english: "you all (m.) told", hint: "לְסַפֵּר", hebrew: "אַתֶּם סִפַּרְתֶּם", wrong: ["אַתֶּם תְּסַפְּרוּ", "אַתֶּם סִפְּרוּ", "אַתֶּם סִפַּרְתָּ"] },
      { english: "they told", hint: "לְסַפֵּר", hebrew: "הֵם סִפְּרוּ", wrong: ["הֵם יְסַפְּרוּ", "הֵם סִפַּרְתֶּם", "הֵם סִפֵּר"] },
      { english: "I will tell", hint: "לְסַפֵּר", hebrew: "אֲנִי אֲסַפֵּר", wrong: ["אֲנִי סִפַּרְתִּי", "אֲנִי נְסַפֵּר", "אֲנִי יְסַפֵּר"] },
      { english: "you (m.) will tell", hint: "לְסַפֵּר", hebrew: "אַתָּה תְּסַפֵּר", wrong: ["אַתָּה סִפַּרְתָּ", "אַתָּה תְּסַפְּרִי", "אַתָּה אֲסַפֵּר"] },
      { english: "you (f.) will tell", hint: "לְסַפֵּר", hebrew: "אַתְּ תְּסַפְּרִי", wrong: ["אַתְּ סִפַּרְתְּ", "אַתְּ תְּסַפֵּר", "אַתְּ נְסַפֵּר"] },
      { english: "he will tell", hint: "לְסַפֵּר", hebrew: "הוּא יְסַפֵּר", wrong: ["הוּא סִפֵּר", "הוּא תְּסַפֵּר", "הוּא אֲסַפֵּר"] },
      { english: "she will tell", hint: "לְסַפֵּר", hebrew: "הִיא תְּסַפֵּר", wrong: ["הִיא סִפְּרָה", "הִיא יְסַפֵּר", "הִיא תְּסַפְּרִי"] },
      { english: "we will tell", hint: "לְסַפֵּר", hebrew: "אֲנַחְנוּ נְסַפֵּר", wrong: ["אֲנַחְנוּ סִפַּרְנוּ", "אֲנַחְנוּ אֲסַפֵּר", "אֲנַחְנוּ יְסַפְּרוּ"] },
      { english: "you all (m.) will tell", hint: "לְסַפֵּר", hebrew: "אַתֶּם תְּסַפְּרוּ", wrong: ["אַתֶּם סִפַּרְתֶּם", "אַתֶּם יְסַפְּרוּ", "אַתֶּם תְּסַפֵּר"] },
      { english: "they will tell", hint: "לְסַפֵּר", hebrew: "הֵם יְסַפְּרוּ", wrong: ["הֵם סִפְּרוּ", "הֵם תְּסַפְּרוּ", "הֵם יְסַפֵּר"] },
      { english: "she told Dana a story", hint: "לְסַפֵּר", hebrew: "הִיא סִפְּרָה לְדָנָה סִפּוּר", wrong: ["הִיא תְּסַפֵּר לְדָנָה סִפּוּר", "הִיא סִפְּרָה אֶת דָּנָה סִפּוּר", "הִיא סִפֵּר לְדָנָה סִפּוּר"] },
      { english: "tomorrow I will tell about the trip", hint: "לְסַפֵּר", hebrew: "מָחָר אֲסַפֵּר עַל הַטִּיּוּל", wrong: ["מָחָר סִפַּרְתִּי עַל הַטִּיּוּל", "מָחָר אֲסַפֵּר לַטִּיּוּל", "מָחָר נְסַפֵּר עַל הַטִּיּוּל"] },
    ],
  },
  {
    id: "conj-hlk", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate ה־ל־ך: went / will go", hebrew: "ה־ל־ך: לָלֶכֶת",
    words: [
      { english: "I went", hint: "לָלֶכֶת", hebrew: "אֲנִי הָלַכְתִּי", wrong: ["אֲנִי אֵלֵךְ", "אֲנִי הָלַכְנוּ", "אֲנִי הָלַךְ"] },
      { english: "you (m.) went", hint: "לָלֶכֶת", hebrew: "אַתָּה הָלַכְתָּ", wrong: ["אַתָּה תֵּלֵךְ", "אַתָּה הָלַכְתְּ", "אַתָּה הָלַכְתִּי"] },
      { english: "you (f.) went", hint: "לָלֶכֶת", hebrew: "אַתְּ הָלַכְתְּ", wrong: ["אַתְּ תֵּלְכִי", "אַתְּ הָלַכְתָּ", "אַתְּ הָלַכְנוּ"] },
      { english: "he went", hint: "לָלֶכֶת", hebrew: "הוּא הָלַךְ", wrong: ["הוּא יֵלֵךְ", "הוּא הָלְכָה", "הוּא הָלַכְתִּי"] },
      { english: "she went", hint: "לָלֶכֶת", hebrew: "הִיא הָלְכָה", wrong: ["הִיא תֵּלֵךְ", "הִיא הָלַךְ", "הִיא הָלַכְתְּ"] },
      { english: "we went", hint: "לָלֶכֶת", hebrew: "אֲנַחְנוּ הָלַכְנוּ", wrong: ["אֲנַחְנוּ נֵלֵךְ", "אֲנַחְנוּ הָלַכְתִּי", "אֲנַחְנוּ הָלְכוּ"] },
      { english: "you all (m.) went", hint: "לָלֶכֶת", hebrew: "אַתֶּם הֲלַכְתֶּם", wrong: ["אַתֶּם תֵּלְכוּ", "אַתֶּם הָלְכוּ", "אַתֶּם הָלַכְתָּ"] },
      { english: "they went", hint: "לָלֶכֶת", hebrew: "הֵם הָלְכוּ", wrong: ["הֵם יֵלְכוּ", "הֵם הֲלַכְתֶּם", "הֵם הָלַךְ"] },
      { english: "I will go", hint: "לָלֶכֶת", hebrew: "אֲנִי אֵלֵךְ", wrong: ["אֲנִי הָלַכְתִּי", "אֲנִי נֵלֵךְ", "אֲנִי יֵלֵךְ"] },
      { english: "you (m.) will go", hint: "לָלֶכֶת", hebrew: "אַתָּה תֵּלֵךְ", wrong: ["אַתָּה הָלַכְתָּ", "אַתָּה תֵּלְכִי", "אַתָּה אֵלֵךְ"] },
      { english: "you (f.) will go", hint: "לָלֶכֶת", hebrew: "אַתְּ תֵּלְכִי", wrong: ["אַתְּ הָלַכְתְּ", "אַתְּ תֵּלֵךְ", "אַתְּ נֵלֵךְ"] },
      { english: "he will go", hint: "לָלֶכֶת", hebrew: "הוּא יֵלֵךְ", wrong: ["הוּא הָלַךְ", "הוּא תֵּלֵךְ", "הוּא אֵלֵךְ"] },
      { english: "she will go", hint: "לָלֶכֶת", hebrew: "הִיא תֵּלֵךְ", wrong: ["הִיא הָלְכָה", "הִיא יֵלֵךְ", "הִיא תֵּלְכִי"] },
      { english: "we will go", hint: "לָלֶכֶת", hebrew: "אֲנַחְנוּ נֵלֵךְ", wrong: ["אֲנַחְנוּ הָלַכְנוּ", "אֲנַחְנוּ אֵלֵךְ", "אֲנַחְנוּ יֵלְכוּ"] },
      { english: "you all (m.) will go", hint: "לָלֶכֶת", hebrew: "אַתֶּם תֵּלְכוּ", wrong: ["אַתֶּם הֲלַכְתֶּם", "אַתֶּם יֵלְכוּ", "אַתֶּם תֵּלֵךְ"] },
      { english: "they will go", hint: "לָלֶכֶת", hebrew: "הֵם יֵלְכוּ", wrong: ["הֵם הָלְכוּ", "הֵם תֵּלְכוּ", "הֵם יֵלֵךְ"] },
      { english: "yesterday they went to the park", hint: "לָלֶכֶת", hebrew: "אֶתְמוֹל הֵם הָלְכוּ לַפַּארְק", wrong: ["אֶתְמוֹל הֵם יֵלְכוּ לַפַּארְק", "אֶתְמוֹל הֵם הָלְכוּ בַּפַּארְק", "אֶתְמוֹל הֵם הָלַךְ לַפַּארְק"] },
      { english: "tomorrow I will go with Dana", hint: "לָלֶכֶת", hebrew: "מָחָר אֵלֵךְ עִם דָּנָה", wrong: ["מָחָר הָלַכְתִּי עִם דָּנָה", "מָחָר אֵלֵךְ אֶת דָּנָה", "מָחָר נֵלֵךְ עִם דָּנָה"] },
    ],
  },
  {
    id: "conj-bo", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate ב־ו־א: came / will come", hebrew: "ב־ו־א: לָבוֹא",
    words: [
      { english: "I came", hint: "לָבוֹא", hebrew: "אֲנִי בָּאתִי", wrong: ["אֲנִי אָבוֹא", "אֲנִי בָּאנוּ", "אֲנִי בָּא"] },
      { english: "you (m.) came", hint: "לָבוֹא", hebrew: "אַתָּה בָּאתָ", wrong: ["אַתָּה תָּבוֹא", "אַתָּה בָּאת", "אַתָּה בָּאתִי"] },
      { english: "you (f.) came", hint: "לָבוֹא", hebrew: "אַתְּ בָּאת", wrong: ["אַתְּ תָּבוֹאִי", "אַתְּ בָּאתָ", "אַתְּ בָּאנוּ"] },
      { english: "he came", hint: "לָבוֹא", hebrew: "הוּא בָּא", wrong: ["הוּא יָבוֹא", "הוּא בָּאָה", "הוּא בָּאתִי"] },
      { english: "she came", hint: "לָבוֹא", hebrew: "הִיא בָּאָה", wrong: ["הִיא תָּבוֹא", "הִיא בָּא", "הִיא בָּאת"] },
      { english: "we came", hint: "לָבוֹא", hebrew: "אֲנַחְנוּ בָּאנוּ", wrong: ["אֲנַחְנוּ נָבוֹא", "אֲנַחְנוּ בָּאתִי", "אֲנַחְנוּ בָּאוּ"] },
      { english: "you all (m.) came", hint: "לָבוֹא", hebrew: "אַתֶּם בָּאתֶם", wrong: ["אַתֶּם תָּבוֹאוּ", "אַתֶּם בָּאוּ", "אַתֶּם בָּאתָ"] },
      { english: "they came", hint: "לָבוֹא", hebrew: "הֵם בָּאוּ", wrong: ["הֵם יָבוֹאוּ", "הֵם בָּאתֶם", "הֵם בָּא"] },
      { english: "I will come", hint: "לָבוֹא", hebrew: "אֲנִי אָבוֹא", wrong: ["אֲנִי בָּאתִי", "אֲנִי נָבוֹא", "אֲנִי יָבוֹא"] },
      { english: "you (m.) will come", hint: "לָבוֹא", hebrew: "אַתָּה תָּבוֹא", wrong: ["אַתָּה בָּאתָ", "אַתָּה תָּבוֹאִי", "אַתָּה אָבוֹא"] },
      { english: "you (f.) will come", hint: "לָבוֹא", hebrew: "אַתְּ תָּבוֹאִי", wrong: ["אַתְּ בָּאת", "אַתְּ תָּבוֹא", "אַתְּ נָבוֹא"] },
      { english: "he will come", hint: "לָבוֹא", hebrew: "הוּא יָבוֹא", wrong: ["הוּא בָּא", "הוּא תָּבוֹא", "הוּא אָבוֹא"] },
      { english: "she will come", hint: "לָבוֹא", hebrew: "הִיא תָּבוֹא", wrong: ["הִיא בָּאָה", "הִיא יָבוֹא", "הִיא תָּבוֹאִי"] },
      { english: "we will come", hint: "לָבוֹא", hebrew: "אֲנַחְנוּ נָבוֹא", wrong: ["אֲנַחְנוּ בָּאנוּ", "אֲנַחְנוּ אָבוֹא", "אֲנַחְנוּ יָבוֹאוּ"] },
      { english: "you all (m.) will come", hint: "לָבוֹא", hebrew: "אַתֶּם תָּבוֹאוּ", wrong: ["אַתֶּם בָּאתֶם", "אַתֶּם יָבוֹאוּ", "אַתֶּם תָּבוֹא"] },
      { english: "they will come", hint: "לָבוֹא", hebrew: "הֵם יָבוֹאוּ", wrong: ["הֵם בָּאוּ", "הֵם תָּבוֹאוּ", "הֵם יָבוֹא"] },
      { english: "yesterday she came from Jerusalem", hint: "לָבוֹא", hebrew: "אֶתְמוֹל הִיא בָּאָה מִירוּשָׁלַיִם", wrong: ["אֶתְמוֹל הִיא תָּבוֹא מִירוּשָׁלַיִם", "אֶתְמוֹל הִיא בָּאָה לִירוּשָׁלַיִם", "אֶתְמוֹל הִיא בָּא מִירוּשָׁלַיִם"] },
      { english: "you all (m.) will come to the party", hint: "לָבוֹא", hebrew: "אַתֶּם תָּבוֹאוּ לַמְּסִבָּה", wrong: ["אַתֶּם בָּאתֶם לַמְּסִבָּה", "אַתֶּם תָּבוֹאוּ מֵהַמְּסִבָּה", "אַתֶּם יָבוֹאוּ לַמְּסִבָּה"] },
    ],
  },
  {
    id: "conj-azr", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate ע־ז־ר: helped / will help", hebrew: "ע־ז־ר: לַעֲזֹר",
    words: [
      { english: "I helped", hint: "לַעֲזֹר", hebrew: "אֲנִי עָזַרְתִּי", wrong: ["אֲנִי אֶעֱזֹר", "אֲנִי עָזַרְנוּ", "אֲנִי עָזַר"] },
      { english: "you (m.) helped", hint: "לַעֲזֹר", hebrew: "אַתָּה עָזַרְתָּ", wrong: ["אַתָּה תַּעֲזֹר", "אַתָּה עָזַרְתְּ", "אַתָּה עָזַרְתִּי"] },
      { english: "you (f.) helped", hint: "לַעֲזֹר", hebrew: "אַתְּ עָזַרְתְּ", wrong: ["אַתְּ תַּעַזְרִי", "אַתְּ עָזַרְתָּ", "אַתְּ עָזַרְנוּ"] },
      { english: "he helped", hint: "לַעֲזֹר", hebrew: "הוּא עָזַר", wrong: ["הוּא יַעֲזֹר", "הוּא עָזְרָה", "הוּא עָזַרְתִּי"] },
      { english: "she helped", hint: "לַעֲזֹר", hebrew: "הִיא עָזְרָה", wrong: ["הִיא תַּעֲזֹר", "הִיא עָזַר", "הִיא עָזַרְתְּ"] },
      { english: "we helped", hint: "לַעֲזֹר", hebrew: "אֲנַחְנוּ עָזַרְנוּ", wrong: ["אֲנַחְנוּ נַעֲזֹר", "אֲנַחְנוּ עָזַרְתִּי", "אֲנַחְנוּ עָזְרוּ"] },
      { english: "you all (m.) helped", hint: "לַעֲזֹר", hebrew: "אַתֶּם עֲזַרְתֶּם", wrong: ["אַתֶּם תַּעַזְרוּ", "אַתֶּם עָזְרוּ", "אַתֶּם עָזַרְתָּ"] },
      { english: "they helped", hint: "לַעֲזֹר", hebrew: "הֵם עָזְרוּ", wrong: ["הֵם יַעַזְרוּ", "הֵם עֲזַרְתֶּם", "הֵם עָזַר"] },
      { english: "I will help", hint: "לַעֲזֹר", hebrew: "אֲנִי אֶעֱזֹר", wrong: ["אֲנִי עָזַרְתִּי", "אֲנִי נַעֲזֹר", "אֲנִי יַעֲזֹר"] },
      { english: "you (m.) will help", hint: "לַעֲזֹר", hebrew: "אַתָּה תַּעֲזֹר", wrong: ["אַתָּה עָזַרְתָּ", "אַתָּה תַּעַזְרִי", "אַתָּה אֶעֱזֹר"] },
      { english: "you (f.) will help", hint: "לַעֲזֹר", hebrew: "אַתְּ תַּעַזְרִי", wrong: ["אַתְּ עָזַרְתְּ", "אַתְּ תַּעֲזֹר", "אַתְּ נַעֲזֹר"] },
      { english: "he will help", hint: "לַעֲזֹר", hebrew: "הוּא יַעֲזֹר", wrong: ["הוּא עָזַר", "הוּא תַּעֲזֹר", "הוּא אֶעֱזֹר"] },
      { english: "she will help", hint: "לַעֲזֹר", hebrew: "הִיא תַּעֲזֹר", wrong: ["הִיא עָזְרָה", "הִיא יַעֲזֹר", "הִיא תַּעַזְרִי"] },
      { english: "we will help", hint: "לַעֲזֹר", hebrew: "אֲנַחְנוּ נַעֲזֹר", wrong: ["אֲנַחְנוּ עָזַרְנוּ", "אֲנַחְנוּ אֶעֱזֹר", "אֲנַחְנוּ יַעַזְרוּ"] },
      { english: "you all (m.) will help", hint: "לַעֲזֹר", hebrew: "אַתֶּם תַּעַזְרוּ", wrong: ["אַתֶּם עֲזַרְתֶּם", "אַתֶּם יַעַזְרוּ", "אַתֶּם תַּעֲזֹר"] },
      { english: "they will help", hint: "לַעֲזֹר", hebrew: "הֵם יַעַזְרוּ", wrong: ["הֵם עָזְרוּ", "הֵם תַּעַזְרוּ", "הֵם יַעֲזֹר"] },
      { english: "yesterday he helped me", hint: "לַעֲזֹר", hebrew: "אֶתְמוֹל הוּא עָזַר לִי", wrong: ["אֶתְמוֹל הוּא יַעֲזֹר לִי", "אֶתְמוֹל הוּא עָזַר אוֹתִי", "אֶתְמוֹל הוּא עָזְרָה לִי"] },
      { english: "we will help Dana with the homework", hint: "לַעֲזֹר", hebrew: "נַעֲזֹר לְדָנָה בְּשִׁעוּרֵי הַבַּיִת", wrong: ["עָזַרְנוּ לְדָנָה בְּשִׁעוּרֵי הַבַּיִת", "נַעֲזֹר אֶת דָּנָה בְּשִׁעוּרֵי הַבַּיִת", "אֶעֱזֹר לְדָנָה בְּשִׁעוּרֵי הַבַּיִת"] },
    ],
  },
  {
    id: "conj-hkh", kind: "conj", pattern: "piel", icon: "🔁", english: "Conjugate ח־כ־ה: waited / will wait", hebrew: "ח־כ־ה: לְחַכּוֹת",
    words: [
      { english: "I waited", hint: "לְחַכּוֹת", hebrew: "אֲנִי חִכִּיתִי", wrong: ["אֲנִי אֲחַכֶּה", "אֲנִי חִכִּינוּ", "אֲנִי חִכָּה"] },
      { english: "you (m.) waited", hint: "לְחַכּוֹת", hebrew: "אַתָּה חִכִּיתָ", wrong: ["אַתָּה תְּחַכֶּה", "אַתָּה חִכִּית", "אַתָּה חִכִּיתִי"] },
      { english: "you (f.) waited", hint: "לְחַכּוֹת", hebrew: "אַתְּ חִכִּית", wrong: ["אַתְּ תְּחַכִּי", "אַתְּ חִכִּיתָ", "אַתְּ חִכִּינוּ"] },
      { english: "he waited", hint: "לְחַכּוֹת", hebrew: "הוּא חִכָּה", wrong: ["הוּא יְחַכֶּה", "הוּא חִכְּתָה", "הוּא חִכִּיתִי"] },
      { english: "she waited", hint: "לְחַכּוֹת", hebrew: "הִיא חִכְּתָה", wrong: ["הִיא תְּחַכֶּה", "הִיא חִכָּה", "הִיא חִכִּית"] },
      { english: "we waited", hint: "לְחַכּוֹת", hebrew: "אֲנַחְנוּ חִכִּינוּ", wrong: ["אֲנַחְנוּ נְחַכֶּה", "אֲנַחְנוּ חִכִּיתִי", "אֲנַחְנוּ חִכּוּ"] },
      { english: "you all (m.) waited", hint: "לְחַכּוֹת", hebrew: "אַתֶּם חִכִּיתֶם", wrong: ["אַתֶּם תְּחַכּוּ", "אַתֶּם חִכּוּ", "אַתֶּם חִכִּיתָ"] },
      { english: "they waited", hint: "לְחַכּוֹת", hebrew: "הֵם חִכּוּ", wrong: ["הֵם יְחַכּוּ", "הֵם חִכִּיתֶם", "הֵם חִכָּה"] },
      { english: "I will wait", hint: "לְחַכּוֹת", hebrew: "אֲנִי אֲחַכֶּה", wrong: ["אֲנִי חִכִּיתִי", "אֲנִי נְחַכֶּה", "אֲנִי יְחַכֶּה"] },
      { english: "you (m.) will wait", hint: "לְחַכּוֹת", hebrew: "אַתָּה תְּחַכֶּה", wrong: ["אַתָּה חִכִּיתָ", "אַתָּה תְּחַכִּי", "אַתָּה אֲחַכֶּה"] },
      { english: "you (f.) will wait", hint: "לְחַכּוֹת", hebrew: "אַתְּ תְּחַכִּי", wrong: ["אַתְּ חִכִּית", "אַתְּ תְּחַכֶּה", "אַתְּ נְחַכֶּה"] },
      { english: "he will wait", hint: "לְחַכּוֹת", hebrew: "הוּא יְחַכֶּה", wrong: ["הוּא חִכָּה", "הוּא תְּחַכֶּה", "הוּא אֲחַכֶּה"] },
      { english: "she will wait", hint: "לְחַכּוֹת", hebrew: "הִיא תְּחַכֶּה", wrong: ["הִיא חִכְּתָה", "הִיא יְחַכֶּה", "הִיא תְּחַכִּי"] },
      { english: "we will wait", hint: "לְחַכּוֹת", hebrew: "אֲנַחְנוּ נְחַכֶּה", wrong: ["אֲנַחְנוּ חִכִּינוּ", "אֲנַחְנוּ אֲחַכֶּה", "אֲנַחְנוּ יְחַכּוּ"] },
      { english: "you all (m.) will wait", hint: "לְחַכּוֹת", hebrew: "אַתֶּם תְּחַכּוּ", wrong: ["אַתֶּם חִכִּיתֶם", "אַתֶּם יְחַכּוּ", "אַתֶּם תְּחַכֶּה"] },
      { english: "they will wait", hint: "לְחַכּוֹת", hebrew: "הֵם יְחַכּוּ", wrong: ["הֵם חִכּוּ", "הֵם תְּחַכּוּ", "הֵם יְחַכֶּה"] },
      { english: "we waited for the bus", hint: "לְחַכּוֹת", hebrew: "חִכִּינוּ לָאוֹטוֹבּוּס", wrong: ["נְחַכֶּה לָאוֹטוֹבּוּס", "חִכִּינוּ אֶת הָאוֹטוֹבּוּס", "חִכִּיתִי לָאוֹטוֹבּוּס"] },
      { english: "she will wait for me at the bus stop", hint: "לְחַכּוֹת", hebrew: "הִיא תְּחַכֶּה לִי בַּתַּחֲנָה", wrong: ["הִיא חִכְּתָה לִי בַּתַּחֲנָה", "הִיא תְּחַכֶּה אוֹתִי בַּתַּחֲנָה", "הִיא יְחַכֶּה לִי בַּתַּחֲנָה"] },
    ],
  },

  // ----- Newer conjugation decks, built with conjWords() (see the top of TOPIC_DECKS) -----
  // Each table: I, you (m.), you (f.), he, she, we, you all (m.), they
  {
    id: "conj-lmd-teach", kind: "conj", pattern: "piel", icon: "🔁", english: "Conjugate ל־מ־ד: taught / will teach", hebrew: "ל־מ־ד: לְלַמֵּד",
    words: [
      ...conjWords("לְלַמֵּד", "taught", "teach",
        ["לִמַּדְתִּי", "לִמַּדְתָּ", "לִמַּדְתְּ", "לִמֵּד", "לִמְּדָה", "לִמַּדְנוּ", "לִמַּדְתֶּם", "לִמְּדוּ"],
        ["אֲלַמֵּד", "תְּלַמֵּד", "תְּלַמְּדִי", "יְלַמֵּד", "תְּלַמֵּד", "נְלַמֵּד", "תְּלַמְּדוּ", "יְלַמְּדוּ"]),
      { english: "last year she taught me Hebrew", hint: "לְלַמֵּד", hebrew: "בַּשָּׁנָה שֶׁעָבְרָה הִיא לִמְּדָה אוֹתִי עִבְרִית", wrong: ["בַּשָּׁנָה שֶׁעָבְרָה הִיא תְּלַמֵּד אוֹתִי עִבְרִית", "בַּשָּׁנָה שֶׁעָבְרָה הִיא לָמְדָה אוֹתִי עִבְרִית", "בַּשָּׁנָה שֶׁעָבְרָה הִיא לִמֵּד אוֹתִי עִבְרִית"] },
      { english: "tomorrow I will teach the class about Jerusalem", hint: "לְלַמֵּד", hebrew: "מָחָר אֲלַמֵּד אֶת הַכִּתָּה עַל יְרוּשָׁלַיִם", wrong: ["מָחָר לִמַּדְתִּי אֶת הַכִּתָּה עַל יְרוּשָׁלַיִם", "מָחָר אֶלְמַד אֶת הַכִּתָּה עַל יְרוּשָׁלַיִם", "מָחָר אֲלַמֵּד לַכִּתָּה עַל יְרוּשָׁלַיִם"] },
    ],
  },
  {
    id: "conj-kra", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate ק־ר־א: read / will read", hebrew: "ק־ר־א: לִקְרֹא",
    words: [
      ...conjWords("לִקְרֹא", "read (past)", "read",
        ["קָרָאתִי", "קָרָאתָ", "קָרָאת", "קָרָא", "קָרְאָה", "קָרָאנוּ", "קְרָאתֶם", "קָרְאוּ"],
        ["אֶקְרָא", "תִּקְרָא", "תִּקְרְאִי", "יִקְרָא", "תִּקְרָא", "נִקְרָא", "תִּקְרְאוּ", "יִקְרְאוּ"]),
      { english: "yesterday I read a book in Hebrew", hint: "לִקְרֹא", hebrew: "אֶתְמוֹל קָרָאתִי סֵפֶר בְּעִבְרִית", wrong: ["אֶתְמוֹל אֶקְרָא סֵפֶר בְּעִבְרִית", "אֶתְמוֹל קָרָאתִי סֵפֶר לְעִבְרִית", "אֶתְמוֹל קָרָאנוּ סֵפֶר בְּעִבְרִית"] },
      { english: "tomorrow you (m.) will read the letter", hint: "לִקְרֹא", hebrew: "מָחָר תִּקְרָא אֶת הַמִּכְתָּב", wrong: ["מָחָר קָרָאתָ אֶת הַמִּכְתָּב", "מָחָר תִּקְרָא הַמִּכְתָּב", "מָחָר תִּקְרְאִי אֶת הַמִּכְתָּב"] },
    ],
  },
  {
    id: "conj-shal", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate ש־א־ל: asked / will ask", hebrew: "ש־א־ל: לִשְׁאֹל",
    words: [
      ...conjWords("לִשְׁאֹל", "asked", "ask",
        ["שָׁאַלְתִּי", "שָׁאַלְתָּ", "שָׁאַלְתְּ", "שָׁאַל", "שָׁאֲלָה", "שָׁאַלְנוּ", "שְׁאַלְתֶּם", "שָׁאֲלוּ"],
        ["אֶשְׁאַל", "תִּשְׁאַל", "תִּשְׁאֲלִי", "יִשְׁאַל", "תִּשְׁאַל", "נִשְׁאַל", "תִּשְׁאֲלוּ", "יִשְׁאֲלוּ"]),
      { english: "yesterday we asked the guide (m.) a question", hint: "לִשְׁאֹל", hebrew: "אֶתְמוֹל שָׁאַלְנוּ אֶת הַמַּדְרִיךְ שְׁאֵלָה", wrong: ["אֶתְמוֹל נִשְׁאַל אֶת הַמַּדְרִיךְ שְׁאֵלָה", "אֶתְמוֹל שָׁאַלְנוּ לַמַּדְרִיךְ שְׁאֵלָה", "אֶתְמוֹל שָׁאַלְתִּי אֶת הַמַּדְרִיךְ שְׁאֵלָה"] },
      { english: "tomorrow they will ask about the trip", hint: "לִשְׁאֹל", hebrew: "מָחָר הֵם יִשְׁאֲלוּ עַל הַטִּיּוּל", wrong: ["מָחָר הֵם שָׁאֲלוּ עַל הַטִּיּוּל", "מָחָר הֵם יִשְׁאֲלוּ אֶת הַטִּיּוּל", "מָחָר הֵם נִשְׁאַל עַל הַטִּיּוּל"] },
    ],
  },
  {
    id: "conj-shma", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate ש־מ־ע: heard / will hear", hebrew: "ש־מ־ע: לִשְׁמֹעַ",
    words: [
      ...conjWords("לִשְׁמֹעַ", "heard", "hear",
        ["שָׁמַעְתִּי", "שָׁמַעְתָּ", "שָׁמַעַתְּ", "שָׁמַע", "שָׁמְעָה", "שָׁמַעְנוּ", "שְׁמַעְתֶּם", "שָׁמְעוּ"],
        ["אֶשְׁמַע", "תִּשְׁמַע", "תִּשְׁמְעִי", "יִשְׁמַע", "תִּשְׁמַע", "נִשְׁמַע", "תִּשְׁמְעוּ", "יִשְׁמְעוּ"]),
      { english: "yesterday I heard a new song", hint: "לִשְׁמֹעַ", hebrew: "אֶתְמוֹל שָׁמַעְתִּי שִׁיר חָדָשׁ", wrong: ["אֶתְמוֹל אֶשְׁמַע שִׁיר חָדָשׁ", "אֶתְמוֹל שָׁמַעְנוּ שִׁיר חָדָשׁ", "אֶתְמוֹל שָׁמַעְתִּי שִׁיר חֲדָשָׁה"] },
      { english: "tomorrow you (f.) will hear about the test", hint: "לִשְׁמֹעַ", hebrew: "מָחָר תִּשְׁמְעִי עַל הַמִּבְחָן", wrong: ["מָחָר שָׁמַעַתְּ עַל הַמִּבְחָן", "מָחָר תִּשְׁמְעִי אֶת הַמִּבְחָן", "מָחָר תִּשְׁמַע עַל הַמִּבְחָן"] },
    ],
  },
  {
    id: "conj-rah", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate ר־א־ה: saw / will see", hebrew: "ר־א־ה: לִרְאוֹת",
    words: [
      ...conjWords("לִרְאוֹת", "saw", "see",
        ["רָאִיתִי", "רָאִיתָ", "רָאִית", "רָאָה", "רָאֲתָה", "רָאִינוּ", "רְאִיתֶם", "רָאוּ"],
        ["אֶרְאֶה", "תִּרְאֶה", "תִּרְאִי", "יִרְאֶה", "תִּרְאֶה", "נִרְאֶה", "תִּרְאוּ", "יִרְאוּ"]),
      { english: "yesterday we saw a movie", hint: "לִרְאוֹת", hebrew: "אֶתְמוֹל רָאִינוּ סֶרֶט", wrong: ["אֶתְמוֹל נִרְאֶה סֶרֶט", "אֶתְמוֹל רָאִיתִי סֶרֶט", "אֶתְמוֹל רָאִינוּ אֶת סֶרֶט"] },
      { english: "tomorrow you all (m.) will see the sea", hint: "לִרְאוֹת", hebrew: "מָחָר תִּרְאוּ אֶת הַיָּם", wrong: ["מָחָר רְאִיתֶם אֶת הַיָּם", "מָחָר תִּרְאוּ הַיָּם", "מָחָר יִרְאוּ אֶת הַיָּם"] },
    ],
  },
  {
    id: "conj-ntn", kind: "conj", pattern: "paal", icon: "🔁", english: "Conjugate נ־ת־ן: gave / will give", hebrew: "נ־ת־ן: לָתֵת",
    words: [
      ...conjWords("לָתֵת", "gave", "give",
        ["נָתַתִּי", "נָתַתָּ", "נָתַתְּ", "נָתַן", "נָתְנָה", "נָתַנּוּ", "נְתַתֶּם", "נָתְנוּ"],
        ["אֶתֵּן", "תִּתֵּן", "תִּתְּנִי", "יִתֵּן", "תִּתֵּן", "נִתֵּן", "תִּתְּנוּ", "יִתְּנוּ"]),
      { english: "yesterday he gave me a gift", hint: "לָתֵת", hebrew: "אֶתְמוֹל הוּא נָתַן לִי מַתָּנָה", wrong: ["אֶתְמוֹל הוּא יִתֵּן לִי מַתָּנָה", "אֶתְמוֹל הוּא נָתַן אוֹתִי מַתָּנָה", "אֶתְמוֹל הוּא נָתְנָה לִי מַתָּנָה"] },
      { english: "tomorrow I will give the book to Dana", hint: "לָתֵת", hebrew: "מָחָר אֶתֵּן אֶת הַסֵּפֶר לְדָנָה", wrong: ["מָחָר נָתַתִּי אֶת הַסֵּפֶר לְדָנָה", "מָחָר אֶתֵּן אֶת הַסֵּפֶר אֶת דָּנָה", "מָחָר נִתֵּן אֶת הַסֵּפֶר לְדָנָה"] },
    ],
  },
];

// Get the premade decks ready, like the levels: label them, and make the feminine copies.
for (const topic of TOPIC_DECKS) {
  topic.topic = true;
  topic.number = topic.icon || "🎯";   // shown where a level would show "3A"
  topic.numberHe = topic.icon || "🎯";
  for (const word of topic.words) {
    homeLevelOf.set(word, topic);
    if (word.f) {
      word.feminine = { ...word, ...word.f };
      homeLevelOf.set(word.feminine, topic);
    }
  }
}

// ---------- Sections of the premade list ----------
// The verb patterns (בִּנְיָנִים), in the order they're shown. To add a pattern later
// (נִפְעַל, הִפְעִיל, הִתְפַּעֵל), add a line here and give its decks that pattern id.
const VERB_PATTERNS = [
  { id: "paal", english: "Verb pattern: pa'al (like לִכְתֹּב)", hebrew: "בִּנְיַן פָּעַל" },
  { id: "piel", english: "Verb pattern: pi'el (like לְדַבֵּר)", hebrew: "בִּנְיַן פִּעֵל" },
];

// Headings for the decks that don't have a verb pattern.
const PREMADE_HEADINGS = {
  theme: { english: "Themes", hebrew: "נוֹשְׂאִים" },
  tense: { english: "Key concepts", hebrew: "מֻשָּׂגֵי מַפְתֵּחַ" },
};

// Which section a premade deck belongs to: { key, english, hebrew, order }.
// order: themes first, then key concepts, then one section per verb pattern.
function premadeSectionOf(deck) {
  const index = VERB_PATTERNS.findIndex((pattern) => pattern.id === deck.pattern);
  if (index >= 0) return { key: "pattern-" + deck.pattern, order: 10 + index, ...VERB_PATTERNS[index] };
  const heading = PREMADE_HEADINGS[deck.kind] || { english: "More decks", hebrew: "עוֹד חֲפִיסוֹת" };
  return { key: deck.kind, order: deck.kind === "theme" ? 0 : deck.kind === "tense" ? 1 : 99, ...heading };
}

// Put TOPIC_DECKS in order: by section, and inside a pattern the 🌱 root decks
// before the 🔁 conjugation decks. (Otherwise they keep the order they're written in.)
function sortPremadeDecks() {
  const rank = (deck) => premadeSectionOf(deck).order * 2 + (deck.kind === "conj" ? 1 : 0);
  TOPIC_DECKS.sort((a, b) => rank(a) - rank(b));
}
sortPremadeDecks();

// The premade decks grouped by section, for the dashboard and the lobby list:
// [{ key, english, hebrew, decks: [...] }, ...]
function premadeSections() {
  const sections = [];
  for (const deck of TOPIC_DECKS) {
    const section = premadeSectionOf(deck);
    let last = sections[sections.length - 1];
    if (!last || last.key !== section.key) {
      last = { key: section.key, english: section.english, hebrew: section.hebrew, decks: [] };
      sections.push(last);
    }
    last.decks.push(deck);
  }
  return sections;
}

// ---------- The deck being played right now ----------

// WORDS = the words of the deck being played. quiz.js and progress.js ask questions from it.
let WORDS = LEVELS[0].words;
let currentDeckId = LEVELS[0].id;

// What the host picked for the room: "auto" (each player gets their own level,
// see progress.js) or one level's id that everyone plays. (null until we join a room.)
const AUTO = "auto";
let roomDeckId = null;

// ---------- Teacher decks ----------
// Decks people make on the "My decks" page (decks.js). They're saved in Supabase,
// and the host's phone sends the one being played to every phone in the room.
// Their ids look like "custom-" + the database id.
const CUSTOM_PREFIX = "custom-";
const customDecks = new Map(); // id → deck (my own decks, plus the room's deck if a host sent one)

// Tidy up a list of wrong answers: real text, not too long, no repeats, never the right answer.
function cleanWrongAnswers(list, rightAnswer) {
  if (!Array.isArray(list)) return [];
  const clean = [];
  for (const item of list) {
    if (typeof item !== "string") continue;
    const text = item.trim().slice(0, DECK_LIMITS.maxTextLength);
    if (text && text !== rightAnswer && !clean.includes(text)) clean.push(text);
    if (clean.length >= DECK_LIMITS.maxWrong) break;
  }
  return clean;
}

// Tidy up a list of words from the database or from another phone:
// keep only real { english, hebrew } pairs, not too long, not too many.
// Optional: wrong (the teacher's own wrong answers) and f (a feminine version,
// from a copied premade deck: { hebrew, wrong }).
function cleanDeckWords(list) {
  if (!Array.isArray(list)) return [];
  const clean = [];
  for (const item of list) {
    if (!item || typeof item.english !== "string" || typeof item.hebrew !== "string") continue;
    const english = item.english.trim().slice(0, DECK_LIMITS.maxTextLength);
    const hebrew = item.hebrew.trim().slice(0, DECK_LIMITS.maxTextLength);
    if (!english || !hebrew) continue;
    const word = { english, hebrew };
    const wrong = cleanWrongAnswers(item.wrong, hebrew);
    if (wrong.length > 0) word.wrong = wrong;
    if (item.f && typeof item.f.hebrew === "string" && item.f.hebrew.trim()) {
      const fHebrew = item.f.hebrew.trim().slice(0, DECK_LIMITS.maxTextLength);
      word.f = { hebrew: fHebrew, wrong: cleanWrongAnswers(item.f.wrong, fHebrew) };
    }
    clean.push(word);
    if (clean.length >= DECK_LIMITS.maxWords) break;
  }
  return clean;
}

// Add (or replace) a teacher deck so it can be picked and played. Returns the deck.
function registerCustomDeck(id, name, words) {
  const cleanName = String(name || "").trim().slice(0, DECK_LIMITS.maxNameLength) || "My deck";
  const deck = {
    id,
    custom: true,
    number: "📚",
    numberHe: "📚",
    english: cleanName,
    hebrew: cleanName,
    words: cleanDeckWords(words),
  };
  // Like the levels: a word with an f: part gets a ready-made feminine copy, and
  // wrong answers are borrowed from this deck.
  for (const word of deck.words) {
    homeLevelOf.set(word, deck);
    if (word.f) {
      word.feminine = { ...word, ...word.f };
      homeLevelOf.set(word.feminine, deck);
    }
  }
  customDecks.set(id, deck);
  return deck;
}

// Find a deck by its id (like "level-3", "review-3" or "custom-..."). Returns undefined if there's no such deck.
function findDeck(deckId) {
  return DECKS.find((deck) => deck.id === deckId)
    || TOPIC_DECKS.find((deck) => deck.id === deckId)
    || customDecks.get(deckId);
}

// Is this something the host is allowed to pick? (Auto, or a real deck with enough words.)
function isDeckChoice(deckId) {
  const deck = findDeck(deckId);
  return deckId === AUTO || (!!deck && deck.words.length >= DECK_LIMITS.minWords);
}

// Switch this phone's questions to another deck.
function useDeck(deckId) {
  const deck = findDeck(deckId);
  if (!deck) return;
  currentDeckId = deck.id;
  const list = deck.review ? mixReviewWords(deck) : deck.checkpoint ? mixCheckpointWords(deck) : deck.words;
  WORDS = list.map(forMyGender);
}

// ---------- Masculine or feminine ("I" and "we") ----------
// Each player picks on the first screen. "m" = masculine, "f" = feminine.
// Saved on this phone.
let myGender = "m";
try { if (localStorage.getItem("golan-gender") === "f") myGender = "f"; } catch {}

function setMyGender(gender) {
  myGender = gender === "f" ? "f" : "m";
  try { localStorage.setItem("golan-gender", myGender); } catch {}
  useDeck(currentDeckId); // swap the questions to the new version
}

// The version of a word for this player: the feminine copy if they picked
// feminine and the word has one, otherwise the word itself.
function forMyGender(word) {
  return myGender === "f" && word.feminine ? word.feminine : word;
}

// The name shown in the lobby, like "3A · Prefixes: the (הַ) and (וְ)" or "3B · Review: levels 1–3".
// Teacher decks are just "📚 Animals".
function deckLabel(deck) {
  if (deck.custom) return `📚 ${deck.english}`;
  if (deck.topic) return `${deck.number} ${deck.english}`; // like "🏫 School" or "🌱 Root כ־ת־ב: write"
  return `${deck.number} · ${deck.english}`;
}
