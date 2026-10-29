"""Three more sample courses (Chemistry, Mathematics, English) so the dashboard shows a full grid."""

COURSES = [
    {
        "key": "chem",
        "name": "Chemistry Fundamentals",
        "description": "Atoms, elements and bonding: the building blocks of everything around us.",
        "color": "#0b7285",
        "instructor": "Dr. Kavita Rao",
        "instructor_title": "Associate Professor, Department of Chemistry",
    },
    {
        "key": "math",
        "name": "Mathematics: Algebra and Functions",
        "description": "From solving equations to reading graphs, with plenty of worked examples.",
        "color": "#3b5bdb",
        "instructor": "Prof. Arjun Mohanty",
        "instructor_title": "Professor, Department of Mathematics",
    },
    {
        "key": "eng",
        "name": "English Communication Skills",
        "description": "Write and speak clearly at work and in college: emails, reports and presentations.",
        "color": "#a61e4d",
        "instructor": "Ms. Sunita Behera",
        "instructor_title": "Lecturer, Department of English",
    },
]

LECTURES = [
    {
        "course": "chem",
        "title": "Atoms and the Periodic Table",
        "days_ago": 12,
        "lang": "en-IN",
        "transcript": (
            "Good morning everyone. Today we begin chemistry from the very start, with the atom and with the periodic table, which is the most useful single chart in all of science. "
            "Let me ask you a question. If you keep cutting a piece of gold into smaller and smaller pieces, what is the smallest piece that is still gold? "
            "The answer is a single gold atom. An atom is the smallest particle of an element that keeps the chemical properties of that element. "
            "Atoms are incredibly small. About a million atoms lined up side by side would be as thick as a human hair. "
            "Every atom is made of three kinds of particles. Protons, neutrons and electrons. "
            "Protons carry a positive charge, electrons carry a negative charge, and neutrons carry no charge at all. "
            "The protons and neutrons sit together in a tiny, dense centre called the nucleus, and the electrons move around the nucleus in regions called shells. "
            "Almost all of the mass of an atom is in the nucleus, because protons and neutrons are about two thousand times heavier than an electron. "
            "Now two numbers that you must remember. The atomic number is the number of protons in the nucleus, and it identifies the element. "
            "Every atom with six protons is carbon, and every atom with eight protons is oxygen. No exceptions. "
            "The mass number is the total number of protons and neutrons together. "
            "In a neutral atom, the number of electrons equals the number of protons, so the positive and negative charges cancel. "
            "Let us take an example. Sodium has atomic number eleven and mass number twenty three. "
            "So it has eleven protons, eleven electrons, and the number of neutrons is twenty three minus eleven, which is twelve. "
            "Now, what about atoms of the same element that have different numbers of neutrons? We call them isotopes. "
            "Carbon always has six protons, but carbon twelve has six neutrons, while carbon fourteen has eight neutrons. "
            "They behave the same chemically, but carbon fourteen is radioactive, and it slowly decays. "
            "Scientists use this to date ancient objects. A living plant takes in carbon fourteen, and when it dies, the amount decreases at a known rate. By measuring what is left, we can tell how old a fossil or a wooden tool is. "
            "Next, how are the electrons arranged? Niels Bohr suggested that electrons occupy shells at fixed distances from the nucleus. "
            "The first shell can hold up to two electrons, the second up to eight, and the third also up to eight for the first twenty elements. "
            "Electrons fill the shells starting from the one closest to the nucleus. "
            "So sodium, with eleven electrons, has the arrangement two, eight, one. Chlorine, with seventeen electrons, has two, eight, seven. "
            "The electrons in the outermost shell are called valence electrons, and they decide how the atom reacts. "
            "Atoms like to have a full outer shell, because that is the most stable arrangement. "
            "This is the reason that helium and neon, which already have full outer shells, hardly react at all. "
            "Now the periodic table. In eighteen sixty nine, the Russian chemist Dmitri Mendeleev arranged the known elements in order of their atomic mass and noticed that similar properties appeared again and again at regular intervals. "
            "He even left gaps for elements that had not yet been discovered, and he predicted their properties. When gallium and germanium were discovered later, they matched his predictions closely. "
            "Today, we arrange the elements by atomic number, and the pattern is even clearer. "
            "The horizontal rows are called periods. The vertical columns are called groups. "
            "There are seven periods and eighteen groups. "
            "Here is the key idea. Elements in the same group have the same number of valence electrons, and therefore similar chemical properties. "
            "Let us look at three important groups. "
            "Group one contains the alkali metals, lithium, sodium and potassium. Each has one valence electron, which it loses easily. They are soft, shiny and extremely reactive. "
            "Sodium reacts violently with water, giving hydrogen gas and sodium hydroxide, and that is why it is stored under oil. "
            "As we go down the group, the reactivity increases, because the outer electron is farther from the nucleus and is held more weakly. "
            "Group seventeen contains the halogens, fluorine, chlorine, bromine and iodine. Each has seven valence electrons, and each is eager to gain one more. "
            "Chlorine is used to kill germs in drinking water, and iodine is added to salt to prevent a disease of the thyroid gland. "
            "Group eighteen contains the noble gases, helium, neon and argon. With full outer shells, they are unreactive, and neon is used in bright signs, while helium fills balloons. "
            "We can also divide the table into metals on the left and in the middle, and non metals on the right, with a few elements in between called metalloids. "
            "Metals are shiny, they conduct heat and electricity, and they can be hammered into sheets and drawn into wires. "
            "Non metals are usually dull, they are poor conductors, and they are brittle when solid. "
            "Now let us see how this explains bonding with one famous example, common salt. "
            "Sodium has one valence electron and chlorine needs one more. Sodium gives its electron to chlorine. "
            "Sodium becomes a positive ion, because it has lost a negative electron, and chlorine becomes a negative ion. "
            "Opposite charges attract strongly, and this attraction is called an ionic bond. The result is sodium chloride, the salt on your dining table. "
            "In other cases, atoms share electrons rather than transfer them, and this is called a covalent bond. "
            "In a water molecule, an oxygen atom shares electrons with two hydrogen atoms, so that all three atoms achieve a full outer shell. "
            "To summarise this lecture, atoms are made of protons, neutrons and electrons, the atomic number identifies the element, isotopes differ in neutrons, electrons sit in shells, and the periodic table groups elements with the same number of valence electrons, which explains their behaviour and how they bond. "
            "For next class, please write the electron arrangement of the first twenty elements, and find where each of them sits in the periodic table. Thank you."
        ),
        "notes": {
            "title": "Atoms and the Periodic Table",
            "summary": "Atoms consist of protons, neutrons and electrons, and the number of protons (atomic number) identifies each element. Electrons sit in shells, and elements in the same group of the periodic table share the same number of valence electrons, which explains their similar chemical behaviour and how they form bonds.",
            "key_points": [
                "The atomic number is the number of protons; the mass number is protons plus neutrons.",
                "Isotopes are atoms of the same element with different numbers of neutrons, such as carbon-12 and carbon-14.",
                "Shells hold 2, 8 and 8 electrons; sodium is 2,8,1 and chlorine is 2,8,7.",
                "Elements in the same group have the same number of valence electrons and similar properties.",
                "Alkali metals are very reactive, halogens eagerly gain an electron, and noble gases are unreactive.",
                "An ionic bond forms by transfer of electrons; a covalent bond forms by sharing them.",
            ],
            "concepts": [
                {"term": "Atomic number", "definition": "The number of protons in the nucleus of an atom, which identifies the element."},
                {"term": "Mass number", "definition": "The total number of protons and neutrons in an atom's nucleus."},
                {"term": "Isotopes", "definition": "Atoms of the same element with the same number of protons but different numbers of neutrons."},
                {"term": "Valence electrons", "definition": "The electrons in the outermost shell, which decide how an atom reacts."},
                {"term": "Group and period", "definition": "Groups are the vertical columns of the periodic table and periods are the horizontal rows."},
                {"term": "Alkali metals", "definition": "The soft, highly reactive metals of group 1, each with one valence electron."},
                {"term": "Ionic bond", "definition": "The attraction between oppositely charged ions formed when electrons are transferred."},
                {"term": "Covalent bond", "definition": "A bond formed when atoms share electrons so each reaches a full outer shell."},
            ],
            "sections": [
                {
                    "heading": "Inside the atom",
                    "points": [
                        "Protons are positive, electrons negative and neutrons neutral.",
                        "Nearly all the mass is in the nucleus; electrons occupy shells.",
                        "Sodium (atomic number 11, mass number 23) has 11 protons, 11 electrons and 12 neutrons.",
                    ],
                },
                {
                    "heading": "Reading the periodic table",
                    "points": [
                        "Mendeleev left gaps and correctly predicted gallium and germanium.",
                        "There are seven periods and eighteen groups, arranged by atomic number.",
                        "Metals are on the left and middle; non metals on the right.",
                    ],
                },
                {
                    "heading": "Three important groups",
                    "points": [
                        "Alkali metals: reactivity increases down the group; sodium is stored under oil.",
                        "Halogens: chlorine disinfects water and iodine prevents thyroid disease.",
                        "Noble gases: neon is used in signs and helium in balloons.",
                    ],
                },
                {
                    "heading": "Bonding examples",
                    "points": [
                        "Sodium gives an electron to chlorine, forming Na+ and Cl- ions and the salt NaCl.",
                        "In water, oxygen shares electrons with two hydrogen atoms.",
                        "Atoms bond to reach a stable full outer shell.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "An atom has atomic number 17 and mass number 35. How many protons, electrons and neutrons does it have?", "answer": "17 protons, 17 electrons and 18 neutrons (35 minus 17)."},
                {"question": "Why are the elements in one group chemically similar?", "answer": "They have the same number of valence electrons."},
                {"question": "Write the electron arrangement of sodium and chlorine.", "answer": "Sodium is 2,8,1 and chlorine is 2,8,7."},
                {"question": "How are ionic and covalent bonds different?", "answer": "In an ionic bond electrons are transferred, forming oppositely charged ions; in a covalent bond electrons are shared."},
                {"question": "How does carbon-14 help scientists date fossils?", "answer": "Carbon-14 is radioactive and decays at a known rate, so the amount remaining shows how long ago the organism died."},
            ],
            "engine": "demo",
            "engine_note": "Sample content for demonstration",
        },
        "chat": [
            "What are isotopes?",
            "Why are noble gases unreactive?",
            "What is the difference between an ionic and a covalent bond?",
        ],
    },
    {
        "course": "math",
        "title": "Linear Equations and Their Graphs",
        "days_ago": 9,
        "lang": "en-IN",
        "transcript": (
            "Hello everyone and welcome. Today's topic is one that you will use for the rest of your life, whether you become an engineer, an accountant or a shop owner. Linear equations and their graphs. "
            "Let us start with the simplest idea. An equation is a statement that two expressions are equal. For example, x plus five equals twelve. "
            "Our job is to find the value of x that makes the statement true. Here, x equals seven. "
            "The key principle is balance. An equation is like a weighing scale. Whatever you do to one side, you must do to the other side, so that the scale stays balanced. "
            "Let me show you with a slightly harder example. Three x plus four equals nineteen. "
            "Step one, remove the four by subtracting four from both sides. This gives three x equals fifteen. "
            "Step two, remove the three by dividing both sides by three. This gives x equals five. "
            "Always check your answer by putting it back into the original equation. Three times five is fifteen, plus four is nineteen. Correct. "
            "What if the variable appears on both sides? Take five x minus three equals two x plus nine. "
            "We collect the x terms on one side by subtracting two x from both sides, which gives three x minus three equals nine. "
            "Then add three to both sides, giving three x equals twelve, and divide by three, so x equals four. "
            "Check, five times four minus three is seventeen, and two times four plus nine is also seventeen. "
            "Now let me show you how equations help in real life. A taxi company charges a fixed fee of forty rupees, plus twelve rupees for every kilometre. "
            "If your fare was one hundred and sixty four rupees, how far did you travel? "
            "Let the distance be d kilometres. The fare is forty plus twelve d, and this equals one hundred and sixty four. "
            "Subtract forty, so twelve d equals one hundred and twenty four. Divide by twelve, and d is a little more than ten, about ten point three kilometres. "
            "Notice how we translated words into an equation first. That step is often the hardest, and it is a skill you must practise. "
            "Now, let us move on to graphs. A graph gives a picture of an equation. "
            "We use two number lines that cross at right angles. The horizontal one is the x axis and the vertical one is the y axis. They cross at the point called the origin. "
            "Every point has two coordinates written in brackets, the x value first and the y value second. "
            "A linear equation in two variables, such as y equals two x plus one, has many solutions. For every value of x, there is a matching value of y. "
            "Let us make a table. If x is zero, y is one. If x is one, y is three. If x is two, y is five. If x is minus one, y is minus one. "
            "Plot these points, and you will see that they all lie on a straight line. That is why we call it a linear equation. "
            "The standard form of a straight line is y equals m x plus c. "
            "Here m is called the slope or gradient, and c is the y intercept, the point where the line crosses the y axis. "
            "In our example, the slope is two and the intercept is one. "
            "What does the slope mean? It tells us how steep the line is. A slope of two means that every time x increases by one, y increases by two. "
            "To find the slope between two points, we divide the change in y by the change in x. "
            "For the points two, three and six, eleven, the change in y is eight, and the change in x is four, so the slope is two. "
            "A positive slope means that the line rises as we go to the right. A negative slope means that it falls. A slope of zero gives a flat horizontal line. "
            "Two lines with the same slope are parallel, and they never meet. "
            "Now let me connect the graph back to the taxi fare. The equation fare equals forty plus twelve d is a straight line. "
            "The intercept forty is the fixed fee, and the slope twelve is the cost per kilometre. "
            "So when you look at a straight line graph in a real situation, the intercept is the starting amount, and the slope is the rate of change. "
            "This idea appears everywhere, in the speed of a moving car, in the savings of a person who adds the same amount each month, and in the cost of a mobile plan. "
            "The last idea for today is solving two equations together. Suppose x plus y equals ten and x minus y equals two. "
            "Each equation is a line, and the solution is the point where the two lines cross. "
            "One easy method is elimination. If we add the two equations, the y terms cancel, giving two x equals twelve, so x equals six. "
            "Substituting back, six plus y equals ten, so y equals four. The lines cross at the point six, four. "
            "Another method is substitution, where we write one variable in terms of the other and place it into the second equation. "
            "To summarise, we balance equations to solve them, we translate word problems into equations, we plot straight lines using a table, we read the slope as the rate and the intercept as the starting value, and we find where two lines meet to solve two equations together. "
            "For homework, solve the ten equations on page twenty five, and plot the graph of y equals three x minus two using at least four points. Thank you."
        ),
        "notes": {
            "title": "Linear Equations and Their Graphs",
            "summary": "A linear equation is solved by keeping both sides balanced, and its graph in two variables is a straight line y = mx + c, where m is the slope (rate of change) and c is the y-intercept (starting value). The point where two lines meet gives the solution of a pair of equations.",
            "key_points": [
                "Do the same operation to both sides of an equation to keep it balanced.",
                "Always check an answer by substituting it back into the original equation.",
                "The graph of y = mx + c is a straight line with slope m and y-intercept c.",
                "Slope = change in y divided by change in x; lines with equal slopes are parallel.",
                "In real situations the intercept is the starting amount and the slope is the rate.",
                "Two simultaneous equations can be solved by elimination or substitution; the solution is where the lines cross.",
            ],
            "concepts": [
                {"term": "Linear equation", "definition": "An equation whose graph is a straight line, such as y = 2x + 1."},
                {"term": "Variable", "definition": "A letter, such as x, that stands for an unknown number."},
                {"term": "Coordinates", "definition": "A pair (x, y) that gives the position of a point on a graph."},
                {"term": "Slope (gradient)", "definition": "How steep a line is: the change in y for each unit change in x."},
                {"term": "Y-intercept", "definition": "The point where a line crosses the y axis, the value of y when x is zero."},
                {"term": "Parallel lines", "definition": "Lines with the same slope that never meet."},
                {"term": "Elimination", "definition": "Adding or subtracting equations to cancel one variable."},
                {"term": "Substitution", "definition": "Replacing one variable with an expression from the other equation."},
            ],
            "sections": [
                {
                    "heading": "Solving equations",
                    "points": [
                        "3x + 4 = 19: subtract 4, then divide by 3 to get x = 5.",
                        "With x on both sides, collect the x terms first: 5x - 3 = 2x + 9 gives x = 4.",
                        "Check by substituting: 5(4) - 3 = 17 and 2(4) + 9 = 17.",
                    ],
                },
                {
                    "heading": "A real-life model",
                    "points": [
                        "Taxi fare = 40 + 12d; a fare of 164 rupees gives d of about 10.3 km.",
                        "Translating words into an equation is the hardest and most important step.",
                        "Mobile plans, savings and speed problems have the same linear form.",
                    ],
                },
                {
                    "heading": "Drawing and reading graphs",
                    "points": [
                        "Make a table of x and y values, plot the points and draw the line.",
                        "For y = 2x + 1 the slope is 2 and the intercept is 1.",
                        "A positive slope rises, a negative slope falls and a zero slope is horizontal.",
                    ],
                },
                {
                    "heading": "Simultaneous equations",
                    "points": [
                        "x + y = 10 and x - y = 2: adding gives 2x = 12, so x = 6 and y = 4.",
                        "The solution is the point (6, 4) where the lines meet.",
                        "Substitution is an alternative to elimination.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "Solve 4x - 7 = 2x + 5.", "answer": "Subtract 2x: 2x - 7 = 5; add 7: 2x = 12; so x = 6."},
                {"question": "Find the slope of the line through (2, 3) and (6, 11).", "answer": "Slope = (11 - 3) / (6 - 2) = 8 / 4 = 2."},
                {"question": "In y = 3x - 2, what are the slope and the y-intercept?", "answer": "The slope is 3 and the y-intercept is -2."},
                {"question": "Solve x + y = 12 and x - y = 4.", "answer": "Adding gives 2x = 16, so x = 8 and y = 4."},
                {"question": "What does the slope of 12 mean in the taxi fare model?", "answer": "The fare rises by 12 rupees for each additional kilometre."},
            ],
            "engine": "demo",
            "engine_note": "Sample content for demonstration",
        },
        "chat": [
            "What does the slope of a line mean?",
            "How do I solve two equations together?",
            "What is the y-intercept?",
        ],
    },
    {
        "course": "eng",
        "title": "Writing Clear Emails and Reports",
        "days_ago": 6,
        "lang": "en-IN",
        "transcript": (
            "Good afternoon everyone. Today we will practise one of the most valuable skills for any career, writing clearly. Most of you will write more emails and reports in your working life than almost anything else, so it is worth getting right. "
            "Let me start with a simple truth. Good writing is not about using difficult words. It is about making it easy for the reader to understand what you want, and to act on it. "
            "Before you write a single word, ask three questions. Who is my reader? What do I want them to know or do? And what is the best way to say it? "
            "These three questions are the purpose, the audience and the message, and they shape everything else. "
            "Let us begin with emails. A good email has five parts. A subject line, a greeting, an opening, a body and a closing. "
            "The subject line is the most important, because it decides whether the email is opened and how quickly. "
            "Compare two subject lines. The first says, hello. The second says, request for leave on fifteenth March, approval needed by Friday. "
            "The second tells the reader what the email is about and when to respond. Be specific, and keep it short. "
            "The greeting should match the relationship. To a professor or an unknown person, write dear professor Sharma, or dear Sir or Madam. To a friendly colleague, hello Ravi is fine. "
            "Next the opening. State your purpose in the very first sentence. For example, I am writing to request two days of leave for a family function. "
            "Do not begin with long background. Busy people read the first line, and they decide from it. "
            "In the body, give the details the reader needs, such as dates, reasons and what you are asking for. Keep to one main idea per paragraph, and use short sentences. "
            "If there are several points, use a short list, so that the reader can follow them easily. "
            "In the closing, say what action you expect and thank the reader. For example, I would be grateful if you could confirm by Friday. Thank you for your time. "
            "Then end with a polite sign off, such as kind regards, followed by your full name and, if useful, your phone number. "
            "Now let me show you a before and after. Here is a poor email. Sir I want leave tomorrow because some work is there at home please give. "
            "And here is the improved version. Dear Sir, I am writing to request leave on Thursday the sixteenth of March, as I need to attend a family function. I will complete my pending assignment before I leave, and I can share my notes with a classmate. I would be grateful for your approval. Thank you. Kind regards, Anil Kumar. "
            "See the difference. The second email is polite, clear, complete and easy to approve. "
            "Next, tone. Tone is the attitude that your words carry. Formal tone is suitable for teachers, employers and official letters, so avoid slang, short forms and emojis. "
            "Informal tone is fine for friends. But even in an informal message, avoid writing in capital letters, because it looks like shouting. "
            "A useful tip is to read your email aloud. If it sounds rude or confusing to you, it will to the reader as well. "
            "Now let us talk about reports. A report is a structured document that presents information and, usually, makes recommendations. "
            "A typical report has a title, a short summary, an introduction, the main findings, a conclusion and recommendations. "
            "The summary comes first, and it gives the whole story in a few lines, so a busy manager can decide whether to read on. "
            "The introduction explains why the report was written. The findings present the facts and data, using headings, short paragraphs and tables where helpful. "
            "The recommendations say clearly what should be done. "
            "Use headings and numbering so the reader can find things quickly. "
            "Now some principles that make any writing clearer. "
            "First, prefer short, simple words. Use, not utilise. Help, not facilitate. Start, not commence. "
            "Second, keep sentences short. A good guide is fifteen to twenty words. If a sentence has more than one idea, split it. "
            "Third, prefer the active voice. Compare, the report was written by the team, with, the team wrote the report. The active version is shorter and more direct. "
            "The passive voice is useful when the doer is unknown or unimportant, but do not overuse it. "
            "Fourth, remove unnecessary words. Instead of, due to the fact that, write, because. Instead of, at this point in time, write, now. "
            "Finally, always proofread. Read your text once for meaning, and once for spelling and grammar. "
            "Check names, dates and numbers carefully, because these are the errors that cause real problems. "
            "Wait a few minutes before sending, if you can, and check that you have attached any files that you mention. "
            "Common mistakes include writing a very long paragraph without breaks, forgetting the subject line, using reply all when you should not, and writing when you are angry. "
            "If you are angry, write the email, but do not send it until you have calmed down and read it again. "
            "To summarise, plan with purpose, audience and message, use a clear structure, match your tone to the reader, prefer short words and active sentences, and always proofread before you send. "
            "For practice, write a formal email to your department asking for a letter of recommendation, and then rewrite it to make it twenty percent shorter. Thank you."
        ),
        "notes": {
            "title": "Writing Clear Emails and Reports",
            "summary": "Clear writing starts with the reader: decide your purpose, audience and message first. A good email has a specific subject line, a purposeful opening, a focused body and a polite closing; a good report puts a short summary first and ends with clear recommendations. Short words, short sentences, the active voice and careful proofreading make writing easier to understand.",
            "key_points": [
                "Ask three questions before writing: who is the reader, what do I want, and how should I say it?",
                "A good email has a specific subject line, greeting, opening, body and closing.",
                "State the purpose in the first sentence and keep one idea per paragraph.",
                "Match the tone to the reader: formal for teachers and employers, informal for friends.",
                "Reports begin with a summary and end with recommendations; headings help readers navigate.",
                "Prefer simple words, short sentences and the active voice, and always proofread.",
            ],
            "concepts": [
                {"term": "Purpose, audience and message", "definition": "The three planning questions that shape any piece of writing."},
                {"term": "Subject line", "definition": "The short line that tells an email reader what it is about and when to respond."},
                {"term": "Tone", "definition": "The attitude carried by your words, such as formal or informal."},
                {"term": "Active voice", "definition": "A sentence where the doer comes first, such as 'the team wrote the report'."},
                {"term": "Passive voice", "definition": "A sentence where the receiver of the action comes first, such as 'the report was written by the team'."},
                {"term": "Executive summary", "definition": "A short opening section of a report that gives the whole story in a few lines."},
                {"term": "Proofreading", "definition": "Checking a text for errors in meaning, spelling, grammar, names, dates and numbers before sending."},
                {"term": "Plain English", "definition": "Writing with simple words and short sentences so that anyone can understand quickly."},
            ],
            "sections": [
                {
                    "heading": "Anatomy of a good email",
                    "points": [
                        "Subject: 'Request for leave on 15 March, approval needed by Friday' beats 'Hello'.",
                        "Opening: state the purpose in the very first sentence.",
                        "Closing: say what action you expect, thank the reader and sign off with your full name.",
                    ],
                },
                {
                    "heading": "Choosing the right tone",
                    "points": [
                        "Avoid slang, short forms and emojis in formal messages.",
                        "Never write in capital letters; it reads as shouting.",
                        "Read your message aloud to check how it sounds.",
                    ],
                },
                {
                    "heading": "Structure of a report",
                    "points": [
                        "Title, summary, introduction, findings, conclusion and recommendations.",
                        "Use headings, numbering and tables so readers can find things quickly.",
                        "The summary lets a busy manager decide whether to read on.",
                    ],
                },
                {
                    "heading": "Making writing clearer",
                    "points": [
                        "Use 'use', 'help' and 'start' instead of 'utilise', 'facilitate' and 'commence'.",
                        "Aim for sentences of about fifteen to twenty words.",
                        "Replace 'due to the fact that' with 'because' and 'at this point in time' with 'now'.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "Why is the subject line the most important part of an email?", "answer": "It decides whether the email is opened and how quickly, so it should state the topic and any deadline."},
                {"question": "Rewrite in the active voice: 'The report was written by the team.'", "answer": "The team wrote the report."},
                {"question": "Replace 'due to the fact that' with a shorter phrase.", "answer": "Because."},
                {"question": "List the main sections of a report.", "answer": "Title, summary, introduction, findings, conclusion and recommendations."},
                {"question": "Give two proofreading checks before sending an email.", "answer": "Check names, dates and numbers, and make sure any attachments you mention are attached."},
            ],
            "engine": "demo",
            "engine_note": "Sample content for demonstration",
        },
        "chat": [
            "What makes a good subject line?",
            "What is the difference between active and passive voice?",
            "How should a report be structured?",
        ],
    },
]
