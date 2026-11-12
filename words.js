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
// icon = the emoji shown before the deck's name.

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

  // ===== Root decks =====
  {
    id: "root-ktv", kind: "root", icon: "🌱", english: "Root כ־ת־ב: write", hebrew: "שֹׁרֶשׁ כ־ת־ב: לִכְתֹּב",
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
    ],
  },
  {
    id: "root-lmd", kind: "root", icon: "🌱", english: "Root ל־מ־ד: learn & teach", hebrew: "שֹׁרֶשׁ ל־מ־ד: לִלְמֹד, לְלַמֵּד",
    words: [
      { english: "to learn", hebrew: "לִלְמֹד", wrong: ["לְלַמֵּד", "לוֹמֵד", "תַּלְמִיד"] },
      { english: "to teach", hebrew: "לְלַמֵּד", wrong: ["לִלְמֹד", "מְלַמֵּד", "מוֹרֶה"] },
      { english: "he learns", hebrew: "הוּא לוֹמֵד", wrong: ["הוּא מְלַמֵּד", "הוּא לוֹמֶדֶת", "הוּא לָמַד"] },
      { english: "she learns", hebrew: "הִיא לוֹמֶדֶת", wrong: ["הִיא מְלַמֶּדֶת", "הִיא לוֹמֵד", "הִיא לָמְדָה"] },
      { english: "they (m.) learn", hebrew: "הֵם לוֹמְדִים", wrong: ["הֵם מְלַמְּדִים", "הֵם לוֹמְדוֹת", "הֵם לוֹמֵד"] },
      { english: "she teaches", hebrew: "הִיא מְלַמֶּדֶת", wrong: ["הִיא לוֹמֶדֶת", "הִיא מְלַמֵּד", "הִיא לִמְּדָה"] },
      { english: "they (f.) teach", hebrew: "הֵן מְלַמְּדוֹת", wrong: ["הֵן לוֹמְדוֹת", "הֵן מְלַמְּדִים", "הֵן מְלַמֶּדֶת"] },
      { english: "a student (m.)", hebrew: "תַּלְמִיד", wrong: ["מְלַמֵּד", "לִמּוּדִים", "תַּלְמִידָה"] },
      { english: "studies", hebrew: "לִמּוּדִים", wrong: ["תַּלְמִידִים", "לוֹמְדִים", "מְלַמְּדִים"] },
      // לוֹמֵד + (a subject, no אֶת) / בְּ (where, or in which language) / עַל (about) / מִ (from whom) / an infinitive
      { english: "he learns Hebrew", hebrew: "הוּא לוֹמֵד עִבְרִית", wrong: ["הוּא לוֹמֵד אֶת עִבְרִית", "הוּא לוֹמֵד בְּעִבְרִית", "הוּא מְלַמֵּד עִבְרִית"] },
      { english: "he learns in Hebrew", hebrew: "הוּא לוֹמֵד בְּעִבְרִית", wrong: ["הוּא לוֹמֵד עִבְרִית", "הוּא לוֹמֵד לְעִבְרִית", "הוּא לוֹמֵד מֵעִבְרִית"] },
      { english: "she learns about Israel", hebrew: "הִיא לוֹמֶדֶת עַל יִשְׂרָאֵל", wrong: ["הִיא לוֹמֶדֶת בְּיִשְׂרָאֵל", "הִיא לוֹמֶדֶת אֶת יִשְׂרָאֵל", "הִיא לוֹמֶדֶת לְיִשְׂרָאֵל"] },
      { english: "she learns in Israel", hebrew: "הִיא לוֹמֶדֶת בְּיִשְׂרָאֵל", wrong: ["הִיא לוֹמֶדֶת עַל יִשְׂרָאֵל", "הִיא לוֹמֶדֶת לְיִשְׂרָאֵל", "הִיא לוֹמֶדֶת מִיִּשְׂרָאֵל"] },
      { english: "she learns from the teacher (m.)", hebrew: "הִיא לוֹמֶדֶת מֵהַמּוֹרֶה", wrong: ["הִיא לוֹמֶדֶת לַמּוֹרֶה", "הִיא לוֹמֶדֶת אֶת הַמּוֹרֶה", "הִיא לוֹמֶדֶת עַל הַמּוֹרֶה"] },
      { english: "the teacher (f.) teaches the class", hebrew: "הַמּוֹרָה מְלַמֶּדֶת אֶת הַכִּתָּה", wrong: ["הַמּוֹרָה לוֹמֶדֶת אֶת הַכִּתָּה", "הַמּוֹרָה מְלַמֶּדֶת לַכִּתָּה", "הַמּוֹרָה מְלַמֶּדֶת הַכִּתָּה"] },
      { english: "he learns to swim", hebrew: "הוּא לוֹמֵד לִשְׂחוֹת", wrong: ["הוּא לוֹמֵד שׂוֹחֶה", "הוּא לוֹמֵד אֶת לִשְׂחוֹת", "הוּא מְלַמֵּד לִשְׂחוֹת"] },
    ],
  },
  {
    id: "root-dbr", kind: "root", icon: "🌱", english: "Root ד־ב־ר: speak", hebrew: "שֹׁרֶשׁ ד־ב־ר: לְדַבֵּר",
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
    ],
  },
  {
    id: "root-avd", kind: "root", icon: "🌱", english: "Root ע־ב־ד: work", hebrew: "שֹׁרֶשׁ ע־ב־ד: לַעֲבֹד",
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
    ],
  },
  {
    id: "root-spr", kind: "root", icon: "🌱", english: "Root ס־פ־ר: tell, count, book", hebrew: "שֹׁרֶשׁ ס־פ־ר: לְסַפֵּר, לִסְפֹּר",
    words: [
      { english: "to tell", hebrew: "לְסַפֵּר", wrong: ["לִסְפֹּר", "מְסַפֵּר", "סִפּוּר"] },
      { english: "to count", hebrew: "לִסְפֹּר", wrong: ["לְסַפֵּר", "סוֹפֵר", "מִסְפָּר"] },
      { english: "he tells", hebrew: "הוּא מְסַפֵּר", wrong: ["הוּא סוֹפֵר", "הוּא מְסַפֶּרֶת", "הוּא סִפֵּר"] },
      { english: "she tells", hebrew: "הִיא מְסַפֶּרֶת", wrong: ["הִיא סוֹפֶרֶת", "הִיא מְסַפֵּר", "הִיא סִפְּרָה"] },
      { english: "they (m.) tell", hebrew: "הֵם מְסַפְּרִים", wrong: ["הֵם סוֹפְרִים", "הֵם מְסַפְּרוֹת", "הֵם מְסַפֵּר"] },
      { english: "he counts", hebrew: "הוּא סוֹפֵר", wrong: ["הוּא מְסַפֵּר", "הוּא סוֹפֶרֶת", "הוּא סָפַר"] },
      { english: "a book", hebrew: "סֵפֶר", wrong: ["סִפּוּר", "סִפְרִיָּה", "סְפָרִים"] },
      { english: "a story", hebrew: "סִפּוּר", wrong: ["סֵפֶר", "מִסְפָּר", "סִפְרִיָּה"] },
      { english: "a library", hebrew: "סִפְרִיָּה", wrong: ["סֵפֶר", "סִפּוּר", "סַפָּר"] },
      { english: "a number", hebrew: "מִסְפָּר", wrong: ["סִפּוּר", "סֵפֶר", "מְסַפֵּר"] },
      { english: "a barber", hebrew: "סַפָּר", wrong: ["סֵפֶר", "סוֹפֵר", "סִפְרִיָּה"] },
      // מְסַפֵּר + לְ (to whom) / עַל (about) / אֶת (what). סוֹפֵר (counts) + אֶת.
      { english: "she tells Dana a story", hebrew: "הִיא מְסַפֶּרֶת לְדָנָה סִפּוּר", wrong: ["הִיא מְסַפֶּרֶת אֶת דָּנָה סִפּוּר", "הִיא מְסַפֶּרֶת עַל דָּנָה סִפּוּר", "הִיא מְסַפֶּרֶת עִם דָּנָה סִפּוּר"] },
      { english: "he tells about the trip", hebrew: "הוּא מְסַפֵּר עַל הַטִּיּוּל", wrong: ["הוּא מְסַפֵּר לַטִּיּוּל", "הוּא מְסַפֵּר אֶת הַטִּיּוּל", "הוּא סוֹפֵר עַל הַטִּיּוּל"] },
      { english: "they (m.) tell the story", hebrew: "הֵם מְסַפְּרִים אֶת הַסִּפּוּר", wrong: ["הֵם מְסַפְּרִים הַסִּפּוּר", "הֵם מְסַפְּרִים לַסִּפּוּר", "הֵם סוֹפְרִים אֶת הַסִּפּוּר"] },
      { english: "he counts the students", hebrew: "הוּא סוֹפֵר אֶת הַתַּלְמִידִים", wrong: ["הוּא מְסַפֵּר אֶת הַתַּלְמִידִים", "הוּא סוֹפֵר הַתַּלְמִידִים", "הוּא סוֹפֵר לַתַּלְמִידִים"] },
      { english: "the books are in the library", hebrew: "הַסְּפָרִים בַּסִּפְרִיָּה", wrong: ["הַסְּפָרִים לַסִּפְרִיָּה", "הַסְּפָרִים מֵהַסִּפְרִיָּה", "הַסֵּפֶר בַּסִּפְרִיָּה"] },
      // The describing word from the root (סָפוּר = counted; סְפוּרִים = only a few) vs. the action (סוֹפֵר = counts)
      { english: "the money is counted", hebrew: "הַכֶּסֶף סָפוּר", wrong: ["הַכֶּסֶף סוֹפֵר", "הַכֶּסֶף סְפוּרָה", "הַכֶּסֶף סִפֵּר"] },
      { english: "only a few days (counted days)", hebrew: "רַק יָמִים סְפוּרִים", wrong: ["רַק יָמִים סוֹפְרִים", "רַק יָמִים סִפּוּרִים", "רַק יָמִים סְפוּרוֹת"] },
    ],
  },
  {
    id: "root-akl-sht", kind: "root", icon: "🌱", english: "Roots א־כ־ל + ש־ת־ה: eat & drink", hebrew: "שָׁרָשִׁים א־כ־ל + ש־ת־ה: לֶאֱכֹל, לִשְׁתּוֹת",
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
    ],
  },
  {
    id: "root-hlk-bo", kind: "root", icon: "🌱", english: "Roots ה־ל־ך + ב־ו־א: go & come", hebrew: "שָׁרָשִׁים ה־ל־ך + ב־ו־א: לָלֶכֶת, לָבוֹא",
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
    ],
  },
  {
    id: "root-hkh-azr", kind: "root", icon: "🌱", english: "Roots ח־כ־ה + ע־ז־ר: wait & help", hebrew: "שָׁרָשִׁים ח־כ־ה + ע־ז־ר: לְחַכּוֹת, לַעֲזֹר",
    words: [
      { english: "to wait", hebrew: "לְחַכּוֹת", wrong: ["מְחַכֶּה", "לַעֲזֹר", "לָלֶכֶת"] },
      { english: "to help", hebrew: "לַעֲזֹר", wrong: ["עוֹזֵר", "לְחַכּוֹת", "עֶזְרָה"] },
      { english: "he waits", hebrew: "הוּא מְחַכֶּה", wrong: ["הוּא מְחַכָּה", "הוּא מְחַכִּים", "הוּא חִכָּה"] },
      { english: "she waits", hebrew: "הִיא מְחַכָּה", wrong: ["הִיא מְחַכֶּה", "הִיא מְחַכּוֹת", "הִיא חִכְּתָה"] },
      { english: "they (m.) wait", hebrew: "הֵם מְחַכִּים", wrong: ["הֵם מְחַכּוֹת", "הֵם מְחַכֶּה", "הֵם חִכּוּ"] },
      { english: "he helps", hebrew: "הוּא עוֹזֵר", wrong: ["הוּא עוֹזֶרֶת", "הוּא עוֹזְרִים", "הוּא עָזַר"] },
      { english: "she helps", hebrew: "הִיא עוֹזֶרֶת", wrong: ["הִיא עוֹזֵר", "הִיא עוֹזְרוֹת", "הִיא עָזְרָה"] },
      { english: "they (m.) help", hebrew: "הֵם עוֹזְרִים", wrong: ["הֵם עוֹזְרוֹת", "הֵם עוֹזֵר", "הֵם עָזְרוּ"] },
      { english: "help (the noun)", hebrew: "עֶזְרָה", wrong: ["עוֹזֵר", "לַעֲזֹר", "עוֹזֶרֶת"] },
      { english: "an assistant (m.)", hebrew: "עוֹזֵר", wrong: ["עֶזְרָה", "עוֹזֶרֶת", "עוֹזְרִים"] },
      { english: "first aid", hebrew: "עֶזְרָה רִאשׁוֹנָה", wrong: ["עֶזְרָה רִאשׁוֹן", "עוֹזֵר רִאשׁוֹן", "רִאשׁוֹנָה עֶזְרָה"] },
      // Both take לְ for the person, NOT אֶת: מְחַכֶּה לְ, עוֹזֵר לְ. So "help me" = עוֹזֵר לִי (not אוֹתִי).
      { english: "he waits for the bus", hebrew: "הוּא מְחַכֶּה לָאוֹטוֹבּוּס", wrong: ["הוּא מְחַכֶּה אֶת הָאוֹטוֹבּוּס", "הוּא מְחַכֶּה בָּאוֹטוֹבּוּס", "הוּא מְחַכֶּה עַל הָאוֹטוֹבּוּס"] },
      { english: "she waits at the bus stop", hebrew: "הִיא מְחַכָּה בַּתַּחֲנָה", wrong: ["הִיא מְחַכָּה לַתַּחֲנָה", "הִיא מְחַכָּה אֶת הַתַּחֲנָה", "הִיא מְחַכָּה מֵהַתַּחֲנָה"] },
      { english: "they (m.) wait for Dana", hebrew: "הֵם מְחַכִּים לְדָנָה", wrong: ["הֵם מְחַכִּים אֶת דָּנָה", "הֵם מְחַכִּים עִם דָּנָה", "הֵם מְחַכִּים בְּדָנָה"] },
      { english: "he waits for me", hebrew: "הוּא מְחַכֶּה לִי", wrong: ["הוּא מְחַכֶּה אוֹתִי", "הוּא מְחַכֶּה אֲנִי", "הוּא מְחַכֶּה לוֹ"] },
      { english: "he helps Dana", hebrew: "הוּא עוֹזֵר לְדָנָה", wrong: ["הוּא עוֹזֵר אֶת דָּנָה", "הוּא עוֹזֵר עַל דָּנָה", "הוּא עוֹזֵר בְּדָנָה"] },
      { english: "they (m.) help me", hebrew: "הֵם עוֹזְרִים לִי", wrong: ["הֵם עוֹזְרִים אוֹתִי", "הֵם עוֹזְרִים אֲנִי", "הֵם עוֹזְרִים לוֹ"] },
      { english: "she helps with the homework", hebrew: "הִיא עוֹזֶרֶת בְּשִׁעוּרֵי הַבַּיִת", wrong: ["הִיא עוֹזֶרֶת אֶת שִׁעוּרֵי הַבַּיִת", "הִיא עוֹזֶרֶת לְשִׁעוּרֵי הַבַּיִת", "הִיא עוֹזֶרֶת מִשִּׁעוּרֵי הַבַּיִת"] },
    ],
  },
  {
    id: "root-kra", kind: "root", icon: "🌱", english: "Root ק־ר־א: read, call", hebrew: "שֹׁרֶשׁ ק־ר־א: לִקְרֹא",
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
    ],
  },
  {
    id: "root-shal", kind: "root", icon: "🌱", english: "Root ש־א־ל: ask, borrow", hebrew: "שֹׁרֶשׁ ש־א־ל: לִשְׁאֹל",
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
    ],
  },
  {
    id: "root-shma", kind: "root", icon: "🌱", english: "Root ש־מ־ע: hear", hebrew: "שֹׁרֶשׁ ש־מ־ע: לִשְׁמֹעַ",
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
    ],
  },
  {
    id: "root-rah", kind: "root", icon: "🌱", english: "Root ר־א־ה: see, look", hebrew: "שֹׁרֶשׁ ר־א־ה: לִרְאוֹת",
    words: [
      { english: "to see", hebrew: "לִרְאוֹת", wrong: ["רוֹאֶה", "מַרְאָה", "לִשְׁמֹעַ"] },
      { english: "he sees", hebrew: "הוּא רוֹאֶה", wrong: ["הוּא רוֹאָה", "הוּא רוֹאִים", "הוּא רָאָה"] },
      { english: "she sees", hebrew: "הִיא רוֹאָה", wrong: ["הִיא רוֹאֶה", "הִיא רוֹאוֹת", "הִיא רָאֲתָה"] },
      { english: "they (m.) see", hebrew: "הֵם רוֹאִים", wrong: ["הֵם רוֹאוֹת", "הֵם רוֹאֶה", "הֵם רָאוּ"] },
      { english: "they (f.) see", hebrew: "הֵן רוֹאוֹת", wrong: ["הֵן רוֹאִים", "הֵן רוֹאָה", "הֵן רָאוּ"] },
      { english: "a mirror", hebrew: "מַרְאָה", wrong: ["מַרְאֶה", "רוֹאָה", "חַלּוֹן"] },
      { english: "see you!", hebrew: "נִתְרָאֶה!", wrong: ["נִרְאֶה!", "רָאִינוּ!", "נִשְׁמַע!"] },
      // רוֹאֶה + אֶת (sees THE …) / nothing (sees A …) / בְּ (on TV) / נִרְאֶה = looks, seems
      { english: "she sees the sea", hebrew: "הִיא רוֹאָה אֶת הַיָּם", wrong: ["הִיא רוֹאָה הַיָּם", "הִיא רוֹאָה לַיָּם", "הִיא רוֹאֶה אֶת הַיָּם"] },
      { english: "he watches a movie", hebrew: "הוּא רוֹאֶה סֶרֶט", wrong: ["הוּא רוֹאֶה אֶת סֶרֶט", "הוּא רוֹאֶה בְּסֶרֶט", "הוּא רוֹאָה סֶרֶט"] },
      { english: "they (m.) watch the game on TV", hebrew: "הֵם רוֹאִים אֶת הַמִּשְׂחָק בַּטֵּלֶוִיזְיָה", wrong: ["הֵם רוֹאִים אֶת הַמִּשְׂחָק לַטֵּלֶוִיזְיָה", "הֵם רוֹאִים אֶת הַמִּשְׂחָק עַל הַטֵּלֶוִיזְיָה", "הֵם רוֹאִים הַמִּשְׂחָק בַּטֵּלֶוִיזְיָה"] },
      { english: "he looks tired", hebrew: "הוּא נִרְאֶה עָיֵף", wrong: ["הוּא רוֹאֶה עָיֵף", "הוּא נִרְאֵית עָיֵף", "הוּא נִרְאֶה עֲיֵפָה"] },
      { english: "she looks happy", hebrew: "הִיא נִרְאֵית שְׂמֵחָה", wrong: ["הִיא רוֹאָה שְׂמֵחָה", "הִיא נִרְאֶה שְׂמֵחָה", "הִיא נִרְאֵית שָׂמֵחַ"] },
    ],
  },
  {
    id: "root-ntn", kind: "root", icon: "🌱", english: "Root נ־ת־ן: give", hebrew: "שֹׁרֶשׁ נ־ת־ן: לָתֵת",
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
    ],
  },
  // ----- Roots with a describing word (2026-11-12): the action (פּוֹתֵחַ = opens) next to the
  // description made from the same root (פָּתוּחַ = open). The wrong answers swap them, and the gender.
  {
    id: "root-pth-sgr", kind: "root", icon: "🌱", english: "Roots פ־ת־ח + ס־ג־ר: open & close", hebrew: "שָׁרָשִׁים פ־ת־ח + ס־ג־ר: לִפְתֹּחַ, לִסְגֹּר",
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
    ],
  },
  {
    id: "root-shbr", kind: "root", icon: "🌱", english: "Root ש־ב־ר: break", hebrew: "שֹׁרֶשׁ ש־ב־ר: לִשְׁבֹּר",
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
      { english: "the cup broke", hebrew: "הַכּוֹס נִשְׁבְּרָה", wrong: ["הַכּוֹס שְׁבוּרָה", "הַכּוֹס נִשְׁבַּר", "הַכּוֹס שָׁבְרָה"] },
      { english: "my leg is broken", hebrew: "הָרֶגֶל שֶׁלִּי שְׁבוּרָה", wrong: ["הָרֶגֶל שֶׁלִּי שָׁבוּר", "הָרֶגֶל שֶׁלִּי שׁוֹבֶרֶת", "הָרֶגֶל שֶׁלִּי שָׁבְרָה"] },
      { english: "the toys are broken", hebrew: "הַצַּעֲצוּעִים שְׁבוּרִים", wrong: ["הַצַּעֲצוּעִים שְׁבוּרוֹת", "הַצַּעֲצוּעִים שׁוֹבְרִים", "הַצַּעֲצוּעִים שָׁבוּר"] },
      { english: "she broke the window", hebrew: "הִיא שָׁבְרָה אֶת הַחַלּוֹן", wrong: ["הִיא שְׁבוּרָה אֶת הַחַלּוֹן", "הִיא נִשְׁבְּרָה אֶת הַחַלּוֹן", "הִיא שָׁבְרָה הַחַלּוֹן"] },
    ],
  },
  {
    id: "root-lbsh-ahv", kind: "root", icon: "🌱", english: "Roots ל־ב־שׁ + א־ה־ב: wear & love", hebrew: "שָׁרָשִׁים ל־ב־שׁ + א־ה־ב: לִלְבֹּשׁ, לֶאֱהֹב",
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
    ],
  },

  // ===== Conjugation decks: one verb in the past and future =====
  // Wrong answers: the same person in the other tense, the other gender (or I <-> we), and another person.
  {
    id: "conj-ktv", kind: "conj", icon: "🔁", english: "Conjugate כ־ת־ב: wrote / will write", hebrew: "כ־ת־ב: לִכְתֹּב",
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
    id: "conj-lmd", kind: "conj", icon: "🔁", english: "Conjugate ל־מ־ד: learned / will learn", hebrew: "ל־מ־ד: לִלְמֹד",
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
    id: "conj-avd", kind: "conj", icon: "🔁", english: "Conjugate ע־ב־ד: worked / will work", hebrew: "ע־ב־ד: לַעֲבֹד",
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
    id: "conj-akl", kind: "conj", icon: "🔁", english: "Conjugate א־כ־ל: ate / will eat", hebrew: "א־כ־ל: לֶאֱכֹל",
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
    id: "conj-sht", kind: "conj", icon: "🔁", english: "Conjugate ש־ת־ה: drank / will drink", hebrew: "ש־ת־ה: לִשְׁתּוֹת",
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
    id: "conj-dbr", kind: "conj", icon: "🔁", english: "Conjugate ד־ב־ר: spoke / will speak", hebrew: "ד־ב־ר: לְדַבֵּר",
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
    id: "conj-spr", kind: "conj", icon: "🔁", english: "Conjugate ס־פ־ר: told / will tell", hebrew: "ס־פ־ר: לְסַפֵּר",
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
    id: "conj-hlk", kind: "conj", icon: "🔁", english: "Conjugate ה־ל־ך: went / will go", hebrew: "ה־ל־ך: לָלֶכֶת",
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
    id: "conj-bo", kind: "conj", icon: "🔁", english: "Conjugate ב־ו־א: came / will come", hebrew: "ב־ו־א: לָבוֹא",
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
    id: "conj-azr", kind: "conj", icon: "🔁", english: "Conjugate ע־ז־ר: helped / will help", hebrew: "ע־ז־ר: לַעֲזֹר",
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
    id: "conj-hkh", kind: "conj", icon: "🔁", english: "Conjugate ח־כ־ה: waited / will wait", hebrew: "ח־כ־ה: לְחַכּוֹת",
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
    id: "conj-lmd-teach", kind: "conj", icon: "🔁", english: "Conjugate ל־מ־ד: taught / will teach", hebrew: "ל־מ־ד: לְלַמֵּד",
    words: [
      ...conjWords("לְלַמֵּד", "taught", "teach",
        ["לִמַּדְתִּי", "לִמַּדְתָּ", "לִמַּדְתְּ", "לִמֵּד", "לִמְּדָה", "לִמַּדְנוּ", "לִמַּדְתֶּם", "לִמְּדוּ"],
        ["אֲלַמֵּד", "תְּלַמֵּד", "תְּלַמְּדִי", "יְלַמֵּד", "תְּלַמֵּד", "נְלַמֵּד", "תְּלַמְּדוּ", "יְלַמְּדוּ"]),
      { english: "last year she taught me Hebrew", hint: "לְלַמֵּד", hebrew: "בַּשָּׁנָה שֶׁעָבְרָה הִיא לִמְּדָה אוֹתִי עִבְרִית", wrong: ["בַּשָּׁנָה שֶׁעָבְרָה הִיא תְּלַמֵּד אוֹתִי עִבְרִית", "בַּשָּׁנָה שֶׁעָבְרָה הִיא לָמְדָה אוֹתִי עִבְרִית", "בַּשָּׁנָה שֶׁעָבְרָה הִיא לִמֵּד אוֹתִי עִבְרִית"] },
      { english: "tomorrow I will teach the class about Jerusalem", hint: "לְלַמֵּד", hebrew: "מָחָר אֲלַמֵּד אֶת הַכִּתָּה עַל יְרוּשָׁלַיִם", wrong: ["מָחָר לִמַּדְתִּי אֶת הַכִּתָּה עַל יְרוּשָׁלַיִם", "מָחָר אֶלְמַד אֶת הַכִּתָּה עַל יְרוּשָׁלַיִם", "מָחָר אֲלַמֵּד לַכִּתָּה עַל יְרוּשָׁלַיִם"] },
    ],
  },
  {
    id: "conj-kra", kind: "conj", icon: "🔁", english: "Conjugate ק־ר־א: read / will read", hebrew: "ק־ר־א: לִקְרֹא",
    words: [
      ...conjWords("לִקְרֹא", "read (past)", "read",
        ["קָרָאתִי", "קָרָאתָ", "קָרָאת", "קָרָא", "קָרְאָה", "קָרָאנוּ", "קְרָאתֶם", "קָרְאוּ"],
        ["אֶקְרָא", "תִּקְרָא", "תִּקְרְאִי", "יִקְרָא", "תִּקְרָא", "נִקְרָא", "תִּקְרְאוּ", "יִקְרְאוּ"]),
      { english: "yesterday I read a book in Hebrew", hint: "לִקְרֹא", hebrew: "אֶתְמוֹל קָרָאתִי סֵפֶר בְּעִבְרִית", wrong: ["אֶתְמוֹל אֶקְרָא סֵפֶר בְּעִבְרִית", "אֶתְמוֹל קָרָאתִי סֵפֶר לְעִבְרִית", "אֶתְמוֹל קָרָאנוּ סֵפֶר בְּעִבְרִית"] },
      { english: "tomorrow you (m.) will read the letter", hint: "לִקְרֹא", hebrew: "מָחָר תִּקְרָא אֶת הַמִּכְתָּב", wrong: ["מָחָר קָרָאתָ אֶת הַמִּכְתָּב", "מָחָר תִּקְרָא הַמִּכְתָּב", "מָחָר תִּקְרְאִי אֶת הַמִּכְתָּב"] },
    ],
  },
  {
    id: "conj-shal", kind: "conj", icon: "🔁", english: "Conjugate ש־א־ל: asked / will ask", hebrew: "ש־א־ל: לִשְׁאֹל",
    words: [
      ...conjWords("לִשְׁאֹל", "asked", "ask",
        ["שָׁאַלְתִּי", "שָׁאַלְתָּ", "שָׁאַלְתְּ", "שָׁאַל", "שָׁאֲלָה", "שָׁאַלְנוּ", "שְׁאַלְתֶּם", "שָׁאֲלוּ"],
        ["אֶשְׁאַל", "תִּשְׁאַל", "תִּשְׁאֲלִי", "יִשְׁאַל", "תִּשְׁאַל", "נִשְׁאַל", "תִּשְׁאֲלוּ", "יִשְׁאֲלוּ"]),
      { english: "yesterday we asked the guide (m.) a question", hint: "לִשְׁאֹל", hebrew: "אֶתְמוֹל שָׁאַלְנוּ אֶת הַמַּדְרִיךְ שְׁאֵלָה", wrong: ["אֶתְמוֹל נִשְׁאַל אֶת הַמַּדְרִיךְ שְׁאֵלָה", "אֶתְמוֹל שָׁאַלְנוּ לַמַּדְרִיךְ שְׁאֵלָה", "אֶתְמוֹל שָׁאַלְתִּי אֶת הַמַּדְרִיךְ שְׁאֵלָה"] },
      { english: "tomorrow they will ask about the trip", hint: "לִשְׁאֹל", hebrew: "מָחָר הֵם יִשְׁאֲלוּ עַל הַטִּיּוּל", wrong: ["מָחָר הֵם שָׁאֲלוּ עַל הַטִּיּוּל", "מָחָר הֵם יִשְׁאֲלוּ אֶת הַטִּיּוּל", "מָחָר הֵם נִשְׁאַל עַל הַטִּיּוּל"] },
    ],
  },
  {
    id: "conj-shma", kind: "conj", icon: "🔁", english: "Conjugate ש־מ־ע: heard / will hear", hebrew: "ש־מ־ע: לִשְׁמֹעַ",
    words: [
      ...conjWords("לִשְׁמֹעַ", "heard", "hear",
        ["שָׁמַעְתִּי", "שָׁמַעְתָּ", "שָׁמַעַתְּ", "שָׁמַע", "שָׁמְעָה", "שָׁמַעְנוּ", "שְׁמַעְתֶּם", "שָׁמְעוּ"],
        ["אֶשְׁמַע", "תִּשְׁמַע", "תִּשְׁמְעִי", "יִשְׁמַע", "תִּשְׁמַע", "נִשְׁמַע", "תִּשְׁמְעוּ", "יִשְׁמְעוּ"]),
      { english: "yesterday I heard a new song", hint: "לִשְׁמֹעַ", hebrew: "אֶתְמוֹל שָׁמַעְתִּי שִׁיר חָדָשׁ", wrong: ["אֶתְמוֹל אֶשְׁמַע שִׁיר חָדָשׁ", "אֶתְמוֹל שָׁמַעְנוּ שִׁיר חָדָשׁ", "אֶתְמוֹל שָׁמַעְתִּי שִׁיר חֲדָשָׁה"] },
      { english: "tomorrow you (f.) will hear about the test", hint: "לִשְׁמֹעַ", hebrew: "מָחָר תִּשְׁמְעִי עַל הַמִּבְחָן", wrong: ["מָחָר שָׁמַעַתְּ עַל הַמִּבְחָן", "מָחָר תִּשְׁמְעִי אֶת הַמִּבְחָן", "מָחָר תִּשְׁמַע עַל הַמִּבְחָן"] },
    ],
  },
  {
    id: "conj-rah", kind: "conj", icon: "🔁", english: "Conjugate ר־א־ה: saw / will see", hebrew: "ר־א־ה: לִרְאוֹת",
    words: [
      ...conjWords("לִרְאוֹת", "saw", "see",
        ["רָאִיתִי", "רָאִיתָ", "רָאִית", "רָאָה", "רָאֲתָה", "רָאִינוּ", "רְאִיתֶם", "רָאוּ"],
        ["אֶרְאֶה", "תִּרְאֶה", "תִּרְאִי", "יִרְאֶה", "תִּרְאֶה", "נִרְאֶה", "תִּרְאוּ", "יִרְאוּ"]),
      { english: "yesterday we saw a movie", hint: "לִרְאוֹת", hebrew: "אֶתְמוֹל רָאִינוּ סֶרֶט", wrong: ["אֶתְמוֹל נִרְאֶה סֶרֶט", "אֶתְמוֹל רָאִיתִי סֶרֶט", "אֶתְמוֹל רָאִינוּ אֶת סֶרֶט"] },
      { english: "tomorrow you all (m.) will see the sea", hint: "לִרְאוֹת", hebrew: "מָחָר תִּרְאוּ אֶת הַיָּם", wrong: ["מָחָר רְאִיתֶם אֶת הַיָּם", "מָחָר תִּרְאוּ הַיָּם", "מָחָר יִרְאוּ אֶת הַיָּם"] },
    ],
  },
  {
    id: "conj-ntn", kind: "conj", icon: "🔁", english: "Conjugate נ־ת־ן: gave / will give", hebrew: "נ־ת־ן: לָתֵת",
    words: [
      ...conjWords("לָתֵת", "gave", "give",
        ["נָתַתִּי", "נָתַתָּ", "נָתַתְּ", "נָתַן", "נָתְנָה", "נָתַנּוּ", "נְתַתֶּם", "נָתְנוּ"],
        ["אֶתֵּן", "תִּתֵּן", "תִּתְּנִי", "יִתֵּן", "תִּתֵּן", "נִתֵּן", "תִּתְּנוּ", "יִתְּנוּ"]),
      { english: "yesterday he gave me a gift", hint: "לָתֵת", hebrew: "אֶתְמוֹל הוּא נָתַן לִי מַתָּנָה", wrong: ["אֶתְמוֹל הוּא יִתֵּן לִי מַתָּנָה", "אֶתְמוֹל הוּא נָתַן אוֹתִי מַתָּנָה", "אֶתְמוֹל הוּא נָתְנָה לִי מַתָּנָה"] },
      { english: "tomorrow I will give the book to Dana", hint: "לָתֵת", hebrew: "מָחָר אֶתֵּן אֶת הַסֵּפֶר לְדָנָה", wrong: ["מָחָר נָתַתִּי אֶת הַסֵּפֶר לְדָנָה", "מָחָר אֶתֵּן אֶת הַסֵּפֶר אֶת דָּנָה", "מָחָר נִתֵּן אֶת הַסֵּפֶר לְדָנָה"] },
    ],
  },
  // ===== Big tense decks (2026-11-12): many verbs, one tense =====
  {
    id: "tense-past", kind: "tense", icon: "⏪", english: "Big deck: past tense", hebrew: "חֲפִיסָה גְּדוֹלָה: עָבָר",
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
    ],
  },
  {
    id: "tense-future", kind: "tense", icon: "⏩", english: "Big deck: future tense", hebrew: "חֲפִיסָה גְּדוֹלָה: עָתִיד",
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
