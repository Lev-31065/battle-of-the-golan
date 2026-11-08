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
      // אֶת + him/her/them becomes one word: אוֹתוֹ (him), אוֹתָהּ (her), אוֹתָם (them, m.), אוֹתָן (them, f.)
      { english: "he sees them (m.)", hint: "לִרְאוֹת", hebrew: "הוּא רוֹאֶה אוֹתָם", wrong: ["הוּא רוֹאֶה אוֹתָן", "הוּא רוֹאֶה אֶת הֵם", "הוּא רוֹאֶה הֵם"] },
      { english: "she knows them (f.)", hint: "לְהַכִּיר", hebrew: "הִיא מַכִּירָה אוֹתָן", wrong: ["הִיא מַכִּירָה אוֹתָם", "הִיא מַכִּירָה אֶת הֵן", "הִיא מַכִּיר אוֹתָן"] },
      { english: "they (f.) hear him", hint: "לִשְׁמֹעַ", hebrew: "הֵן שׁוֹמְעוֹת אוֹתוֹ", wrong: ["הֵן שׁוֹמְעוֹת אוֹתָהּ", "הֵן שׁוֹמְעוֹת אֶת הוּא", "הֵם שׁוֹמְעִים אוֹתוֹ"] },
      { english: "you all (m.) see her", hint: "לִרְאוֹת", hebrew: "אַתֶּם רוֹאִים אוֹתָהּ", wrong: ["אַתֶּם רוֹאִים אוֹתוֹ", "אַתֶּם רוֹאִים אֶת הִיא", "אַתֶּן רוֹאוֹת אוֹתָהּ"] },
      { english: "you all (f.) open the window", hint: "לִפְתֹּחַ", hebrew: "אַתֶּן פּוֹתְחוֹת אֶת הַחַלּוֹן", wrong: ["אַתֶּן פּוֹתְחוֹת הַחַלּוֹן", "אַתֶּם פּוֹתְחִים אֶת הַחַלּוֹן", "אַתֶּן פּוֹתְחוֹת אֶת חַלּוֹן"] },
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

// ---------- Level names: A and B ----------
// Every level has an A part (its new words) and, from level 2 on, a B part
// (review: its words mixed with earlier ones). So the order is 1, 2A, 2B, 3A, 3B ... 15B.
// Level 1 is just "1", because it has no B part.
// In Hebrew they're written with Hebrew letters: 3א, 3ב.
//
// ---------- Review levels (2B, 3B ... 15B) ----------
// These are built automatically, so nobody has to write them by hand.
// Level 12B = the words of level 12 + the same number of random words from levels 1–11.
// (There's no 1B, because there's nothing before level 1 to review.)
// The random half is picked again each time the review level is chosen.

// Remember which level each word comes from (quiz.js uses this to borrow
// wrong answers from the word's OWN level, so a single word isn't next to sentences).
const homeLevelOf = new Map();
LEVELS.forEach((level, index) => {
  // Level 1 is just "1" (there's no 1B, so the "A" would be confusing).
  level.number = index === 0 ? "1" : (index + 1) + "A";     // shown in English, like "3A"
  level.numberHe = index === 0 ? "1" : (index + 1) + "א";   // shown in Hebrew, like "3א"
  for (const word of level.words) {
    homeLevelOf.set(word, level);
    // A word with an f: part gets a ready-made feminine copy (same English and hint).
    if (word.f) {
      word.feminine = { ...word, ...word.f };
      homeLevelOf.set(word.feminine, level);
    }
  }
});

// DECKS = every level in order: 1, 2A, 2B, 3A, 3B ... 15A, 15B.
const DECKS = [];
LEVELS.forEach((level, index) => {
  DECKS.push(level);
  if (index === 0) return;
  const upTo = index + 1;
  DECKS.push({
    id: "review-" + upTo,
    number: upTo + "B",
    numberHe: upTo + "ב",
    english: `Review: levels 1–${upTo}`,
    hebrew: `חֲזָרָה: רָמוֹת 1–${upTo}`,
    review: true,
    newLevel: level,                      // the level being reviewed (half the questions)
    earlier: LEVELS.slice(0, index).flatMap((l) => l.words), // everything before it
    words: LEVELS.slice(0, upTo).flatMap((l) => l.words),    // all of it (for "you know X of Y")
  });
});

// Make the question list for a review level: the newest level + an equal number of earlier words.
function mixReviewWords(deck) {
  const earlier = [...deck.earlier].sort(() => Math.random() - 0.5);
  return [...deck.newLevel.words, ...earlier.slice(0, deck.newLevel.words.length)];
}

// ---------- Topic decks ----------
// Ready-made decks that each practice ONE idea. They're not part of the level ladder
// (Auto never picks them); the host picks one in the lobby, under "Topics".
// Same format as the levels above (wrong answers, hint, f: for the feminine "I"/"we").
const TOPIC_DECKS = [
  {
    id: "topic-pronouns", english: "Pronouns: I, you, he, she…", hebrew: "כִּנּוּיֵי גּוּף: אֲנִי, אַתָּה, הוּא…",
    words: [
      { english: "I", hebrew: "אֲנִי", wrong: ["אַתָּה", "הוּא", "אֲנַחְנוּ"] },
      { english: "you (m.)", hebrew: "אַתָּה", wrong: ["אַתְּ", "אַתֶּם", "הוּא"] },
      { english: "you (f.)", hebrew: "אַתְּ", wrong: ["אַתָּה", "אַתֶּן", "הִיא"] },
      { english: "he", hebrew: "הוּא", wrong: ["הִיא", "הֵם", "אַתָּה"] },
      { english: "she", hebrew: "הִיא", wrong: ["הוּא", "הֵן", "אַתְּ"] },
      { english: "we", hebrew: "אֲנַחְנוּ", wrong: ["אֲנִי", "הֵם", "אַתֶּם"] },
      { english: "you all (m.)", hebrew: "אַתֶּם", wrong: ["אַתֶּן", "הֵם", "אַתָּה"] },
      { english: "you all (f.)", hebrew: "אַתֶּן", wrong: ["אַתֶּם", "הֵן", "אַתְּ"] },
      { english: "they (m.)", hebrew: "הֵם", wrong: ["הֵן", "אַתֶּם", "הוּא"] },
      { english: "they (f.)", hebrew: "הֵן", wrong: ["הֵם", "אַתֶּן", "הִיא"] },
      { english: "he is a teacher", hebrew: "הוּא מוֹרֶה", wrong: ["הִיא מוֹרֶה", "הוּא מוֹרָה", "הֵם מוֹרִים"] },
      { english: "she is a teacher", hebrew: "הִיא מוֹרָה", wrong: ["הוּא מוֹרָה", "הִיא מוֹרֶה", "הֵן מוֹרוֹת"] },
      { english: "I am a student", hebrew: "אֲנִי תַּלְמִיד", wrong: ["אֲנִי תַּלְמִידָה", "אַתָּה תַּלְמִיד", "אֲנַחְנוּ תַּלְמִידִים"],
        f: { hebrew: "אֲנִי תַּלְמִידָה", wrong: ["אֲנִי תַּלְמִיד", "אַתְּ תַּלְמִידָה", "אֲנַחְנוּ תַּלְמִידוֹת"] } },
      { english: "you (f.) are here", hebrew: "אַתְּ כָּאן", wrong: ["אַתָּה כָּאן", "הִיא כָּאן", "אַתֶּן כָּאן"] },
      { english: "we are at home", hebrew: "אֲנַחְנוּ בַּבַּיִת", wrong: ["הֵם בַּבַּיִת", "אֲנִי בַּבַּיִת", "אַתֶּם בַּבַּיִת"] },
      { english: "you all (m.) are students", hebrew: "אַתֶּם תַּלְמִידִים", wrong: ["אַתֶּן תַּלְמִידוֹת", "הֵם תַּלְמִידִים", "אַתָּה תַּלְמִיד"] },
      { english: "they (m.) are in the park", hebrew: "הֵם בַּפַּארְק", wrong: ["הֵן בַּפַּארְק", "אַתֶּם בַּפַּארְק", "הוּא בַּפַּארְק"] },
      { english: "they (f.) are friends", hebrew: "הֵן חֲבֵרוֹת", wrong: ["הֵם חֲבֵרִים", "הֵן חֲבֵרִים", "אַתֶּן חֲבֵרוֹת"] },
    ],
  },
  {
    // אֶת + a pronoun = one word: "they love HER" = הֵם אוֹהֲבִים אוֹתָהּ (not "הֵם אוֹהֲבִים הִיא").
    id: "topic-object-pronouns", english: "Object pronouns: me, him, her… (אוֹתִי, אוֹתוֹ, אוֹתָהּ)", hebrew: "אֶת + כִּנּוּי: אוֹתִי, אוֹתוֹ, אוֹתָהּ…",
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
      { english: "they (m.) like her", hint: "לֶאֱהֹב", hebrew: "הֵם אוֹהֲבִים אוֹתָהּ", wrong: ["הֵם אוֹהֲבִים הִיא", "הֵם אוֹהֲבִים אוֹתוֹ", "הֵם אוֹהֲבִים אֶת הִיא"] },
      { english: "she loves him", hint: "לֶאֱהֹב", hebrew: "הִיא אוֹהֶבֶת אוֹתוֹ", wrong: ["הִיא אוֹהֶבֶת הוּא", "הִיא אוֹהֶבֶת אוֹתָהּ", "הִיא אוֹהֶבֶת אֶת הוּא"] },
      { english: "he knows me", hint: "לְהַכִּיר", hebrew: "הוּא מַכִּיר אוֹתִי", wrong: ["הוּא מַכִּיר אֲנִי", "הוּא מַכִּיר אוֹתוֹ", "הוּא מַכִּירָה אוֹתִי"] },
      { english: "I see you (m.)", hint: "לִרְאוֹת", hebrew: "אֲנִי רוֹאֶה אוֹתְךָ", wrong: ["אֲנִי רוֹאֶה אַתָּה", "אֲנִי רוֹאֶה אוֹתָךְ", "אֲנִי רוֹאָה אוֹתְךָ"],
        f: { hebrew: "אֲנִי רוֹאָה אוֹתְךָ", wrong: ["אֲנִי רוֹאָה אַתָּה", "אֲנִי רוֹאָה אוֹתָךְ", "אֲנִי רוֹאֶה אוֹתְךָ"] } },
      { english: "I love you (f.)", hint: "לֶאֱהֹב", hebrew: "אֲנִי אוֹהֵב אוֹתָךְ", wrong: ["אֲנִי אוֹהֵב אַתְּ", "אֲנִי אוֹהֵב אוֹתְךָ", "אֲנִי אוֹהֶבֶת אוֹתָךְ"],
        f: { hebrew: "אֲנִי אוֹהֶבֶת אוֹתָךְ", wrong: ["אֲנִי אוֹהֶבֶת אַתְּ", "אֲנִי אוֹהֶבֶת אוֹתְךָ", "אֲנִי אוֹהֵב אוֹתָךְ"] } },
      { english: "you (f.) understand me", hint: "לְהָבִין", hebrew: "אַתְּ מְבִינָה אוֹתִי", wrong: ["אַתְּ מְבִינָה אֲנִי", "אַתָּה מֵבִין אוֹתִי", "אַתְּ מְבִינָה אוֹתָךְ"] },
      { english: "we invite you all (m.)", hint: "לְהַזְמִין", hebrew: "אֲנַחְנוּ מַזְמִינִים אֶתְכֶם", wrong: ["אֲנַחְנוּ מַזְמִינִים אַתֶּם", "אֲנַחְנוּ מַזְמִינִים אוֹתָם", "אֲנַחְנוּ מַזְמִינִים אֶתְכֶן"],
        f: { hebrew: "אֲנַחְנוּ מַזְמִינוֹת אֶתְכֶם", wrong: ["אֲנַחְנוּ מַזְמִינוֹת אַתֶּם", "אֲנַחְנוּ מַזְמִינוֹת אוֹתָם", "אֲנַחְנוּ מַזְמִינוֹת אֶתְכֶן"] } },
      { english: "the teacher asks us", hint: "לִשְׁאֹל", hebrew: "הַמּוֹרֶה שׁוֹאֵל אוֹתָנוּ", wrong: ["הַמּוֹרֶה שׁוֹאֵל אֲנַחְנוּ", "הַמּוֹרֶה שׁוֹאֵל אוֹתָם", "הַמּוֹרֶה שׁוֹאֵל אוֹתִי"] },
      { english: "Dana sees them (m.)", hint: "לִרְאוֹת", hebrew: "דָּנָה רוֹאָה אוֹתָם", wrong: ["דָּנָה רוֹאָה הֵם", "דָּנָה רוֹאָה אוֹתָן", "דָּנָה רוֹאָה אוֹתוֹ"] },
      { english: "they (f.) know them (f.)", hint: "לְהַכִּיר", hebrew: "הֵן מַכִּירוֹת אוֹתָן", wrong: ["הֵן מַכִּירוֹת הֵן", "הֵן מַכִּירוֹת אוֹתָם", "הֵם מַכִּירִים אוֹתָן"] },
    ],
  },
  {
    // All the one-letter prefixes (אוֹתִיּוֹת הַשִּׁמּוּשׁ) mixed together, including two at once (וּבַ־, וּמִ־).
    id: "topic-prefixes", english: "All the prefixes: הַ וְ בְּ לְ מִ שֶׁ כְּשֶׁ", hebrew: "אוֹתִיּוֹת הַשִּׁמּוּשׁ: הַ וְ בְּ לְ מִ שֶׁ כְּשֶׁ",
    words: [
      { english: "and the girl", hebrew: "וְהַיַּלְדָּה", wrong: ["הַיַּלְדָּה", "וְיַלְדָּה", "וְהַיֶּלֶד"] },
      { english: "in the sea", hebrew: "בַּיָּם", wrong: ["לַיָּם", "מֵהַיָּם", "הַיָּם"] },
      { english: "to the sea", hebrew: "לַיָּם", wrong: ["בַּיָּם", "מֵהַיָּם", "לְיָם"] },
      { english: "from the sea", hebrew: "מֵהַיָּם", wrong: ["לַיָּם", "בַּיָּם", "מִיָּם"] },
      { english: "in a book", hebrew: "בְּסֵפֶר", wrong: ["בַּסֵּפֶר", "לְסֵפֶר", "מִסֵּפֶר"] },
      { english: "with a pen", hebrew: "בְּעֵט", wrong: ["לְעֵט", "מֵעֵט", "עֵט"] },
      { english: "from the store", hebrew: "מֵהַחֲנוּת", wrong: ["לַחֲנוּת", "בַּחֲנוּת", "מֵחֲנוּת"] },
      { english: "for the children", hebrew: "לַיְלָדִים", wrong: ["בַּיְלָדִים", "מֵהַיְלָדִים", "הַיְלָדִים"] },
      { english: "and in the house", hebrew: "וּבַבַּיִת", wrong: ["בַּבַּיִת", "וּבְבַיִת", "וְהַבַּיִת"] },
      { english: "and to the city", hebrew: "וְלָעִיר", wrong: ["לָעִיר", "וּבָעִיר", "וְהָעִיר"] },
      { english: "and from Jerusalem", hebrew: "וּמִירוּשָׁלַיִם", wrong: ["מִירוּשָׁלַיִם", "וְלִירוּשָׁלַיִם", "וּבִירוּשָׁלַיִם"] },
      { english: "the boy that I saw", hebrew: "הַיֶּלֶד שֶׁרָאִיתִי", wrong: ["הַיֶּלֶד רָאִיתִי", "הַיֶּלֶד כְּשֶׁרָאִיתִי", "הַיֶּלֶד שֶׁרָאָה"] },
      { english: "the book that is in the bag", hebrew: "הַסֵּפֶר שֶׁבַּתִּיק", wrong: ["הַסֵּפֶר בַּתִּיק", "הַסֵּפֶר שֶׁבְּתִיק", "הַסֵּפֶר שֶׁלַּתִּיק"] },
      { english: "when we arrived", hebrew: "כְּשֶׁהִגַּעְנוּ", wrong: ["שֶׁהִגַּעְנוּ", "כְּשֶׁהִגִּיעוּ", "כְּהִגַּעְנוּ"] },
    ],
  },
];

// Get the topic decks ready, like the levels: label them, and make the feminine copies.
for (const topic of TOPIC_DECKS) {
  topic.topic = true;
  topic.number = "🎯";
  topic.numberHe = "🎯";
  for (const word of topic.words) {
    homeLevelOf.set(word, topic);
    if (word.f) {
      word.feminine = { ...word, ...word.f };
      homeLevelOf.set(word.feminine, topic);
    }
  }
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

// Tidy up a list of words from the database or from another phone:
// keep only real { english, hebrew } pairs, not too long, not too many.
function cleanDeckWords(list) {
  if (!Array.isArray(list)) return [];
  const clean = [];
  for (const item of list) {
    if (!item || typeof item.english !== "string" || typeof item.hebrew !== "string") continue;
    const english = item.english.trim().slice(0, DECK_LIMITS.maxTextLength);
    const hebrew = item.hebrew.trim().slice(0, DECK_LIMITS.maxTextLength);
    if (english && hebrew) clean.push({ english, hebrew });
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
  WORDS = (deck.review ? mixReviewWords(deck) : deck.words).map(forMyGender);
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
  if (deck.topic) return `🎯 ${deck.english}`;
  return `${deck.number} · ${deck.english}`;
}
