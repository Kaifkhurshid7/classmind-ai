"""Sample courses, faculty and lectures used to populate a demo instance.

Everything here is fictional sample content written for demonstration. Notes are
hand-written (engine "demo") so the demo looks the way a good AI result would.
"""

COURSES = [
    {
        "key": "bio",
        "name": "Biology 101",
        "description": "Foundations of life science: cells, energy and the molecules of heredity.",
        "color": "#0056d2",
        "instructor": "Dr. Anita Sharma",
        "instructor_title": "Associate Professor, Department of Life Sciences",
    },
    {
        "key": "phy",
        "name": "Physics Basics",
        "description": "Motion, force and energy explained step by step, with everyday examples.",
        "color": "#0e7c66",
        "instructor": "Prof. Rajesh Menon",
        "instructor_title": "Professor, Department of Physics",
    },
    {
        "key": "cs",
        "name": "Introduction to Python Programming",
        "description": "Learn to think like a programmer: variables, decisions, functions and problem solving.",
        "color": "#7a3fc4",
        "instructor": "Ms. Priya Nair",
        "instructor_title": "Assistant Professor, Department of Computer Science",
    },
    {
        "key": "hist",
        "name": "Modern Indian History",
        "description": "The story of India's freedom struggle, from the first uprisings to mass movements.",
        "color": "#c2570c",
        "instructor": "Dr. Sourav Patnaik",
        "instructor_title": "Senior Lecturer, Department of History",
    },
    {
        "key": "eco",
        "name": "Principles of Microeconomics",
        "description": "How individuals and firms make choices, and how markets bring them together.",
        "color": "#b4234f",
        "instructor": "Prof. Meera Iyer",
        "instructor_title": "Professor, School of Economics",
    },
]

# Each lecture: course key, title, days_ago (when it was recorded), lang, transcript,
# curated notes, and chat questions students asked the tutor.
LECTURES = [
    # ------------------------------------------------------------------ Biology
    {
        "course": "bio",
        "title": "Photosynthesis: How Plants Make Food",
        "days_ago": 34,
        "lang": "en-IN",
        "transcript": (
            "Good morning everyone. Today we are going to talk about photosynthesis, which is how plants make their own food. "
            "Let me start with a question. Where does the energy in your breakfast ultimately come from? "
            "If you trace it back far enough, almost all of it comes from the sun, and plants are the bridge between sunlight and life on earth. "
            "Photosynthesis is the process by which green plants, algae and some bacteria convert light energy into chemical energy stored in glucose. "
            "The overall equation is simple. Six molecules of carbon dioxide and six molecules of water, in the presence of light, give one molecule of glucose and six molecules of oxygen. "
            "Now, where does this happen? It takes place in the chloroplasts, which are small green organelles found mainly in leaf cells. "
            "Inside each chloroplast there are stacks of flat sacs called thylakoids, and a fluid around them called the stroma. "
            "The green colour comes from chlorophyll, a pigment that absorbs red and blue light and reflects green light, which is why leaves look green to us. "
            "Photosynthesis has two stages. The first stage is the light reactions, and they happen in the thylakoid membranes. "
            "Here chlorophyll absorbs sunlight and the energy is used to split water molecules. "
            "This releases oxygen as a by product, and it produces two energy carrying molecules called ATP and NADPH. "
            "The second stage is the Calvin cycle, which happens in the stroma. "
            "It does not need light directly, but it depends on the ATP and NADPH made in the first stage. "
            "In the Calvin cycle an enzyme called rubisco fixes carbon dioxide from the air and, step by step, builds it into glucose. "
            "Please remember that the oxygen we breathe comes from water, not from carbon dioxide. This is a very common exam mistake. "
            "Now let us think about what controls the rate of photosynthesis. "
            "Light intensity matters, because more light means faster light reactions until the plant reaches saturation. "
            "Carbon dioxide concentration matters, because the Calvin cycle needs it. "
            "Temperature matters too, because enzymes like rubisco work best within a certain range, and above that they start to denature. "
            "These factors can limit each other, and we call the one in shortest supply the limiting factor. "
            "A greenhouse farmer uses this idea every day by controlling light, heat and carbon dioxide to grow more crops. "
            "Finally, why does all this matter? Glucose is used by the plant for energy or stored as starch, and the oxygen released keeps our atmosphere breathable. "
            "Without photosynthesis there would be no oxygen for animals to breathe and no food chain. "
            "For next class, please draw a chloroplast and label the thylakoid, the stroma and the grana. Thank you."
        ),
        "notes": {
            "title": "Photosynthesis: How Plants Make Food",
            "summary": "Photosynthesis converts light energy into chemical energy stored in glucose, using carbon dioxide and water and releasing oxygen. It happens in two stages inside chloroplasts: the light reactions and the Calvin cycle.",
            "key_points": [
                "Photosynthesis turns light energy into chemical energy stored as glucose.",
                "Overall: 6CO2 + 6H2O + light gives C6H12O6 + 6O2.",
                "Light reactions occur in the thylakoid membranes; the Calvin cycle occurs in the stroma.",
                "The oxygen released comes from water, not from carbon dioxide.",
            ],
            "concepts": [
                {"term": "Chloroplast", "definition": "The green organelle in plant cells where photosynthesis takes place."},
                {"term": "Chlorophyll", "definition": "The green pigment that absorbs red and blue light and drives the light reactions."},
                {"term": "Light reactions", "definition": "The first stage, in the thylakoid membranes, that splits water and makes ATP, NADPH and oxygen."},
                {"term": "Calvin cycle", "definition": "The second stage, in the stroma, that uses ATP, NADPH and carbon dioxide to build glucose."},
                {"term": "Limiting factor", "definition": "The condition in shortest supply, such as light, carbon dioxide or temperature, that caps the rate of photosynthesis."},
            ],
            "sections": [
                {
                    "heading": "Where it happens",
                    "points": [
                        "Chloroplasts are found mainly in leaf cells.",
                        "Thylakoids are stacked flat sacs; the stroma is the fluid around them.",
                        "Chlorophyll reflects green light, so leaves look green.",
                    ],
                },
                {
                    "heading": "The two stages",
                    "points": [
                        "Light reactions split water, release oxygen and make ATP and NADPH.",
                        "The Calvin cycle uses the enzyme rubisco to fix carbon dioxide into glucose.",
                        "The Calvin cycle does not need light directly but depends on the products of the light reactions.",
                    ],
                },
                {
                    "heading": "What controls the rate",
                    "points": [
                        "Light intensity, carbon dioxide concentration and temperature all affect the rate.",
                        "High temperature can denature enzymes such as rubisco.",
                        "Greenhouses control these factors to increase crop yield.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "Where does the oxygen released in photosynthesis come from?", "answer": "From the splitting of water molecules in the light reactions, not from carbon dioxide."},
                {"question": "Name the two stages of photosynthesis and where each takes place.", "answer": "The light reactions in the thylakoid membranes and the Calvin cycle in the stroma."},
                {"question": "What is a limiting factor?", "answer": "The factor in shortest supply, such as light, carbon dioxide or temperature, which restricts the rate of photosynthesis."},
            ],
        },
        "chat": [
            "Where does the oxygen come from in photosynthesis?",
            "What is the role of chlorophyll?",
            "What is rubisco and why does it matter?",
        ],
    },
    {
        "course": "bio",
        "title": "The Cell: Structure and Function",
        "days_ago": 29,
        "lang": "en-IN",
        "transcript": (
            "Welcome back. Last week we spoke about the molecules of life, and today we zoom in to the unit that holds them together, the cell. "
            "The cell is the basic structural and functional unit of all living organisms. "
            "Some organisms, like bacteria, have just one cell, while a human body has trillions of them. "
            "Cell theory has three simple ideas. All living things are made of cells, the cell is the basic unit of life, and all cells come from pre existing cells. "
            "Let us tour a typical animal cell. At the outside we have the cell membrane, a thin flexible layer that controls which substances enter and leave the cell. "
            "Inside, the nucleus is the control centre. It contains the genetic material, DNA, which carries the instructions for building proteins. "
            "Around the nucleus is the cytoplasm, a jelly like fluid in which the organelles are suspended. "
            "Mitochondria are the organelles that release energy from food through cellular respiration, and that is why we call them the powerhouse of the cell. "
            "Ribosomes are tiny structures where proteins are made. Some float freely and some sit on the rough endoplasmic reticulum. "
            "The endoplasmic reticulum is a network of membranes that transports proteins and lipids inside the cell. "
            "The Golgi apparatus then packs and sends these molecules to where they are needed, like a post office for the cell. "
            "Lysosomes contain enzymes that break down waste and worn out parts. "
            "Now, how is a plant cell different? Plant cells have a rigid cell wall made of cellulose outside the membrane, which gives them shape and support. "
            "They also have chloroplasts for photosynthesis, which animal cells do not have. "
            "And a large central vacuole stores water and nutrients, and keeps the cell firm. "
            "Another big division is between prokaryotic and eukaryotic cells. "
            "Prokaryotic cells, such as bacteria, have no true nucleus and no membrane bound organelles, and their DNA floats in the cytoplasm. "
            "Eukaryotic cells, which include plants, animals and fungi, have a true nucleus and membrane bound organelles. "
            "A good way to remember all this is to compare the cell to a small factory. "
            "The nucleus is the manager's office, the mitochondria are the power station, the ribosomes are the machines, and the membrane is the security gate. "
            "Please try to draw both an animal cell and a plant cell for the next class, and write one function beside each organelle."
        ),
        "notes": {
            "title": "The Cell: Structure and Function",
            "summary": "The cell is the basic unit of life. Eukaryotic cells contain specialised organelles, such as the nucleus and mitochondria, that each perform a specific job. Plant cells differ from animal cells by having a cell wall, chloroplasts and a large central vacuole.",
            "key_points": [
                "Cell theory: all living things are made of cells, the cell is the basic unit of life, and all cells come from pre existing cells.",
                "The nucleus holds DNA; mitochondria release energy; ribosomes make proteins.",
                "Plant cells have a cell wall, chloroplasts and a large central vacuole; animal cells do not.",
                "Prokaryotic cells have no true nucleus, while eukaryotic cells do.",
            ],
            "concepts": [
                {"term": "Cell membrane", "definition": "A thin flexible layer that controls which substances enter and leave the cell."},
                {"term": "Nucleus", "definition": "The control centre of the cell, containing DNA."},
                {"term": "Mitochondria", "definition": "Organelles that release energy from food through cellular respiration."},
                {"term": "Ribosomes", "definition": "Tiny structures where proteins are made."},
                {"term": "Eukaryotic cell", "definition": "A cell with a true nucleus and membrane bound organelles, found in plants, animals and fungi."},
            ],
            "sections": [
                {
                    "heading": "Organelles and their jobs",
                    "points": [
                        "The endoplasmic reticulum transports proteins and lipids inside the cell.",
                        "The Golgi apparatus packs and dispatches molecules.",
                        "Lysosomes break down waste and worn out parts with enzymes.",
                    ],
                },
                {
                    "heading": "Plant versus animal cells",
                    "points": [
                        "A rigid cellulose cell wall gives plant cells shape and support.",
                        "Chloroplasts allow plant cells to photosynthesise.",
                        "A large central vacuole stores water and nutrients.",
                    ],
                },
                {
                    "heading": "Prokaryotes and eukaryotes",
                    "points": [
                        "Prokaryotes such as bacteria have DNA floating in the cytoplasm.",
                        "Eukaryotes have a true nucleus and membrane bound organelles.",
                        "The cell can be compared to a factory with different departments.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "State the three ideas of cell theory.", "answer": "All living things are made of cells, the cell is the basic unit of life, and all cells come from pre existing cells."},
                {"question": "Why are mitochondria called the powerhouse of the cell?", "answer": "They release energy from food through cellular respiration."},
                {"question": "Name three structures found in plant cells but not in animal cells.", "answer": "A cell wall, chloroplasts and a large central vacuole."},
            ],
        },
        "chat": [
            "What is the difference between prokaryotic and eukaryotic cells?",
            "What do mitochondria do?",
            "Why do plant cells have a cell wall?",
        ],
    },
    {
        "course": "bio",
        "title": "DNA to Protein: Transcription and Translation",
        "days_ago": 22,
        "lang": "en-IN",
        "transcript": (
            "Good morning. Today's topic connects two ideas you already know, DNA and proteins, and asks one big question. How does a sequence of letters in DNA become a working protein? "
            "The answer is called the central dogma of molecular biology, and it can be written in three words. DNA makes RNA makes protein. "
            "Let us begin with DNA. DNA is a double helix made of two strands. Each strand is a chain of nucleotides, and each nucleotide has a sugar, a phosphate and one of four bases, adenine, thymine, guanine and cytosine. "
            "The bases pair in a fixed way. Adenine pairs with thymine, and guanine pairs with cytosine. "
            "The order of bases along a gene is the code. "
            "Now, DNA stays safe inside the nucleus, but proteins are made on ribosomes in the cytoplasm. So the cell needs a messenger. "
            "That messenger is mRNA, or messenger RNA. RNA differs from DNA in three ways. It is single stranded, it has the sugar ribose, and it uses uracil in place of thymine. "
            "The first step is transcription. In transcription, an enzyme called RNA polymerase reads one strand of the gene in the nucleus and builds a matching mRNA copy. "
            "The mRNA then leaves the nucleus and travels to a ribosome. "
            "The second step is translation, where the ribosome reads the mRNA three letters at a time. Each group of three letters is called a codon, and each codon stands for one amino acid. "
            "Transfer RNA, or tRNA, brings the correct amino acid to the ribosome. "
            "The amino acids are joined one after another into a chain, and that chain folds into a protein. "
            "For example, the codon AUG codes for methionine and also acts as the start signal. Stop codons tell the ribosome to finish. "
            "Why does this matter? A change in the DNA sequence is called a mutation. "
            "Sometimes a single changed base alters one amino acid and the protein stops working properly. Sickle cell anaemia is a well known example. "
            "But many mutations are harmless, and some even give useful variation for evolution. "
            "To summarise, transcription copies the gene into mRNA in the nucleus, and translation uses that mRNA to build a protein at the ribosome. "
            "In the next class we will look at how cells copy their entire DNA before dividing."
        ),
        "notes": {
            "title": "DNA to Protein: Transcription and Translation",
            "summary": "Genetic information flows from DNA to RNA to protein. Transcription copies a gene into mRNA in the nucleus, and translation reads the mRNA at a ribosome, three bases at a time, to build a chain of amino acids.",
            "key_points": [
                "The central dogma: DNA makes RNA makes protein.",
                "Transcription happens in the nucleus; translation happens at the ribosome.",
                "A codon is three bases and codes for one amino acid.",
                "A mutation is a change in the DNA sequence and can change or damage a protein.",
            ],
            "concepts": [
                {"term": "Transcription", "definition": "Copying a gene from DNA into messenger RNA, done by RNA polymerase in the nucleus."},
                {"term": "Translation", "definition": "Reading mRNA at a ribosome to join amino acids into a protein."},
                {"term": "Codon", "definition": "A group of three bases on mRNA that stands for one amino acid or a stop signal."},
                {"term": "mRNA", "definition": "Single stranded messenger that carries a gene's code from the nucleus to the ribosome."},
                {"term": "Mutation", "definition": "A change in the DNA base sequence."},
            ],
            "sections": [
                {
                    "heading": "DNA and RNA",
                    "points": [
                        "DNA is a double helix; adenine pairs with thymine and guanine pairs with cytosine.",
                        "RNA is single stranded, uses ribose and has uracil instead of thymine.",
                        "The order of bases in a gene is the genetic code.",
                    ],
                },
                {
                    "heading": "Making a protein",
                    "points": [
                        "RNA polymerase builds an mRNA copy of one DNA strand.",
                        "tRNA brings the matching amino acid to the ribosome.",
                        "AUG is the start codon and codes for methionine; stop codons end the chain.",
                    ],
                },
                {
                    "heading": "Why mutations matter",
                    "points": [
                        "A single base change can alter one amino acid, as in sickle cell anaemia.",
                        "Many mutations are harmless.",
                        "Some mutations provide variation that drives evolution.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "List three differences between DNA and RNA.", "answer": "RNA is single stranded, contains ribose, and uses uracil instead of thymine."},
                {"question": "What is a codon?", "answer": "A group of three bases on mRNA that codes for one amino acid or a stop signal."},
                {"question": "Where do transcription and translation take place?", "answer": "Transcription in the nucleus and translation at the ribosome in the cytoplasm."},
            ],
        },
        "chat": [
            "What is a codon?",
            "What is the difference between transcription and translation?",
            "How does a mutation cause a disease?",
            "What is a codon?",
        ],
    },
    # ------------------------------------------------------------------ Physics
    {
        "course": "phy",
        "title": "Newton's Laws of Motion",
        "days_ago": 31,
        "lang": "en-IN",
        "transcript": (
            "Good morning everyone. Today we study the three laws that explain almost every motion you see around you, Newton's laws of motion. "
            "Before the laws, we need one idea, force. A force is a push or a pull that can change the state of motion of an object. "
            "Force is measured in newtons, and one newton is the force that gives a mass of one kilogram an acceleration of one metre per second squared. "
            "Newton's first law states that an object stays at rest or moves with constant velocity unless a net force acts on it. "
            "This tendency to resist a change in motion is called inertia, and the heavier an object is, the greater its inertia. "
            "Think about a bus that suddenly brakes. Your body keeps moving forward because of inertia, and that is why we wear seat belts. "
            "Newton's second law tells us how force changes motion. It says that force equals mass multiplied by acceleration, or F equals m a. "
            "So for the same force, a lighter object accelerates more and a heavier object accelerates less. "
            "Let us do a quick example. A force of twenty newtons acts on a four kilogram trolley. The acceleration is twenty divided by four, which is five metres per second squared. "
            "Notice that force and acceleration always point in the same direction. "
            "Newton's third law states that for every action there is an equal and opposite reaction. "
            "When you push a wall, the wall pushes back on you with the same force. "
            "When a rocket pushes hot gas downward, the gas pushes the rocket upward. "
            "A very common confusion is this. If action and reaction are equal and opposite, why do things ever move? "
            "The answer is that the two forces act on different objects, so they never cancel each other. "
            "Let us also talk about friction, since it appears in almost every problem. "
            "Friction is a force that opposes the relative motion between two surfaces in contact. "
            "It is the reason a rolling ball slows down, and it is also the reason you can walk without slipping. "
            "Finally, do not mix up mass and weight. Mass is the amount of matter in an object and is measured in kilograms. "
            "Weight is the force of gravity acting on that mass, and it is measured in newtons. "
            "On the moon your mass stays the same, but your weight is about one sixth of what it is on earth. "
            "For homework, solve the five problems on page forty and draw a free body diagram for each."
        ),
        "notes": {
            "title": "Newton's Laws of Motion",
            "summary": "Newton's three laws describe how forces change motion. The first law defines inertia, the second gives F = ma, and the third says forces come in equal and opposite pairs acting on different objects.",
            "key_points": [
                "First law: an object keeps its state of rest or uniform motion unless a net force acts on it.",
                "Second law: force equals mass times acceleration (F = ma).",
                "Third law: every action has an equal and opposite reaction, acting on different objects.",
                "Mass is the amount of matter; weight is the force of gravity on it.",
            ],
            "concepts": [
                {"term": "Force", "definition": "A push or a pull that can change the state of motion of an object, measured in newtons."},
                {"term": "Inertia", "definition": "The tendency of an object to resist a change in its motion; greater for heavier objects."},
                {"term": "Newton", "definition": "The unit of force: the force that gives one kilogram an acceleration of one metre per second squared."},
                {"term": "Friction", "definition": "A force that opposes relative motion between two surfaces in contact."},
                {"term": "Weight", "definition": "The force of gravity acting on the mass of an object, measured in newtons."},
            ],
            "sections": [
                {
                    "heading": "The three laws",
                    "points": [
                        "A passenger lurches forward when a bus brakes because of inertia.",
                        "For a given force, a lighter object accelerates more than a heavier one.",
                        "A rocket moves up because the gas it pushes down pushes back on it.",
                    ],
                },
                {
                    "heading": "Worked example",
                    "points": [
                        "A 20 N force on a 4 kg trolley gives a = 20 / 4 = 5 m/s squared.",
                        "Force and acceleration point in the same direction.",
                        "Action and reaction never cancel because they act on different bodies.",
                    ],
                },
                {
                    "heading": "Friction and weight",
                    "points": [
                        "Friction slows a rolling ball and lets us walk without slipping.",
                        "Mass stays constant everywhere; weight depends on gravity.",
                        "On the moon weight is about one sixth of that on earth.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "A 6 kg object is pushed with a net force of 30 N. What is its acceleration?", "answer": "a = F / m = 30 / 6 = 5 metres per second squared."},
                {"question": "Why do action and reaction forces not cancel out?", "answer": "Because they act on two different objects, not on the same one."},
                {"question": "What is the difference between mass and weight?", "answer": "Mass is the amount of matter and is constant; weight is the gravitational force on that mass and depends on where you are."},
            ],
        },
        "chat": [
            "Why do action and reaction not cancel each other?",
            "What is inertia?",
            "How do I calculate acceleration from force and mass?",
        ],
    },
    {
        "course": "phy",
        "title": "Work, Energy and Power",
        "attempts": 0,  # not practised yet, so the demo shows a mix of states
        "days_ago": 24,
        "lang": "en-IN",
        "transcript": (
            "Hello everyone. In the last class we studied forces. Today we ask a related question. When a force acts, how much has it actually achieved? "
            "In physics, work is done when a force moves an object in the direction of the force. "
            "Work equals force multiplied by displacement, and its unit is the joule. "
            "One joule is the work done when a force of one newton moves an object through one metre. "
            "There is an important catch. If you hold a heavy bag and stand still, you feel tired, but in physics you have done no work, because there is no displacement. "
            "Likewise, a force at ninety degrees to the motion, like gravity on a person walking on level ground, does no work. "
            "Next, energy. Energy is the capacity to do work, and it is also measured in joules. "
            "Kinetic energy is the energy of motion. It equals half times mass times velocity squared. "
            "Because velocity is squared, doubling the speed of a car makes its kinetic energy four times larger, and that is why high speed crashes are so dangerous. "
            "Potential energy is stored energy because of position. Gravitational potential energy equals mass times g times height. "
            "A ball at the top of a ramp has potential energy, and as it rolls down that energy turns into kinetic energy. "
            "This brings us to the law of conservation of energy. Energy can neither be created nor destroyed, it can only change from one form to another. "
            "In a pendulum, energy keeps switching between kinetic and potential, and if we ignore air resistance the total stays constant. "
            "In real life some energy always turns into heat and sound, so we say it is dissipated, but the total energy of the universe is still conserved. "
            "Finally, power. Power is the rate of doing work, so power equals work divided by time. The unit is the watt, which is one joule per second. "
            "A one hundred watt bulb uses one hundred joules of electrical energy every second. "
            "Here is a quick problem. A student lifts a ten kilogram box through two metres in four seconds. Taking g as ten, the work done is ten times ten times two, which is two hundred joules. "
            "The power is two hundred divided by four, which is fifty watts. "
            "Please revise the formulas and attempt the numerical problems at the end of the chapter."
        ),
        "notes": {
            "title": "Work, Energy and Power",
            "summary": "Work is force acting through a displacement, energy is the capacity to do work, and power is the rate at which work is done. Energy is conserved: it only changes form, for example from potential to kinetic.",
            "key_points": [
                "Work = force x displacement in the direction of the force, measured in joules.",
                "Kinetic energy = 1/2 m v squared; gravitational potential energy = m g h.",
                "Energy is conserved; it changes from one form to another.",
                "Power = work / time, measured in watts (joules per second).",
            ],
            "concepts": [
                {"term": "Work", "definition": "Done when a force moves an object in the direction of the force; force times displacement."},
                {"term": "Kinetic energy", "definition": "The energy of motion, equal to half times mass times velocity squared."},
                {"term": "Potential energy", "definition": "Stored energy due to position, such as gravitational potential energy mgh."},
                {"term": "Conservation of energy", "definition": "Energy can neither be created nor destroyed, only converted from one form to another."},
                {"term": "Power", "definition": "The rate of doing work; work divided by time, measured in watts."},
            ],
            "sections": [
                {
                    "heading": "When is work done?",
                    "points": [
                        "Holding a bag without moving does no work because there is no displacement.",
                        "A force at ninety degrees to the motion does no work.",
                        "One joule is one newton acting through one metre.",
                    ],
                },
                {
                    "heading": "Forms of energy",
                    "points": [
                        "Doubling speed makes kinetic energy four times larger.",
                        "A ball on a ramp converts potential energy to kinetic energy.",
                        "In a pendulum energy swaps between kinetic and potential.",
                    ],
                },
                {
                    "heading": "Worked example",
                    "points": [
                        "Lifting 10 kg through 2 m with g = 10 requires 200 J of work.",
                        "Doing this in 4 s needs 50 W of power.",
                        "A 100 W bulb uses 100 J every second.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "Why does doubling the speed of a car quadruple its kinetic energy?", "answer": "Because kinetic energy depends on the square of velocity."},
                {"question": "Does a person holding a heavy bag at rest do work in the physics sense?", "answer": "No, because there is no displacement."},
                {"question": "A motor does 600 J of work in 12 s. What is its power?", "answer": "Power = 600 / 12 = 50 watts."},
            ],
        },
        "chat": [
            "Why does holding a bag not count as work?",
            "What is the difference between kinetic and potential energy?",
        ],
    },
    # ------------------------------------------------------------------ Python
    {
        "course": "cs",
        "title": "Variables, Data Types and Decisions",
        "days_ago": 27,
        "lang": "en-IN",
        "transcript": (
            "Hi everyone, and welcome to your first real Python class. Today we learn three building blocks that every program uses, variables, data types and decisions. "
            "Let us start with variables. A variable is a named container that stores a value in the computer's memory. "
            "In Python you create one just by assigning a value, for example age equals twenty. There is no need to declare the type in advance. "
            "Variable names should be meaningful, they can contain letters, digits and underscores, but they cannot start with a digit. "
            "Python is case sensitive, so score and Score are two different variables. "
            "Now data types. The most common types are integers for whole numbers, floats for numbers with a decimal point, strings for text, and booleans, which hold either True or False. "
            "You can check the type of any value using the type function. "
            "Strings are written inside quotes, and you can join two strings using the plus sign. "
            "A common mistake is to try to add a number and a string directly. Python will raise a type error, so you must convert the number first using the str function. "
            "Similarly, the input function always returns a string, so if you want a number you wrap it in int or float. "
            "Next, operators. We have the usual plus, minus, multiply and divide. Two special ones are the double slash for floor division and the percent sign for the remainder. "
            "For example, seventeen percent five gives two. Remainders are very useful, for instance to check whether a number is even. "
            "Comparison operators such as double equals, not equals, greater than and less than produce booleans. "
            "Please note that a single equals sign assigns a value, while a double equals sign compares two values. Mixing these up is the most common beginner bug. "
            "This leads us to decisions. We use the if statement to run code only when a condition is true. "
            "If the condition is false, we can use else, and when there are several cases we use elif. "
            "Indentation matters in Python. The lines inside an if block must be indented by the same amount, usually four spaces. "
            "Here is a small example. If marks is greater than or equal to forty, print pass, else print fail. "
            "We can also combine conditions using and, or and not. "
            "For practice, write a program that asks for a number and prints whether it is positive, negative or zero. We will check it together next class."
        ),
        "notes": {
            "title": "Variables, Data Types and Decisions",
            "summary": "A Python program stores values in variables, works with data types such as integers, floats, strings and booleans, and makes decisions with if, elif and else. Indentation defines code blocks.",
            "key_points": [
                "A variable is a named container for a value; Python infers its type.",
                "Core types are int, float, str and bool.",
                "A single = assigns a value; a double == compares two values.",
                "if, elif and else choose which block runs, and indentation defines the block.",
            ],
            "concepts": [
                {"term": "Variable", "definition": "A named container that stores a value in memory."},
                {"term": "Data type", "definition": "The kind of value stored, such as int, float, str or bool."},
                {"term": "Boolean", "definition": "A value that is either True or False, produced by comparisons."},
                {"term": "Modulus operator", "definition": "The percent sign, which gives the remainder after division."},
                {"term": "Conditional statement", "definition": "An if, elif or else statement that runs code only when a condition is true."},
            ],
            "sections": [
                {
                    "heading": "Variables and types",
                    "points": [
                        "Names may use letters, digits and underscores but cannot start with a digit.",
                        "Python is case sensitive, so score and Score differ.",
                        "Use type() to check a value's type.",
                    ],
                },
                {
                    "heading": "Common mistakes",
                    "points": [
                        "Adding a number to a string raises a type error; convert with str().",
                        "input() always returns a string; wrap it in int() or float().",
                        "Confusing = with == is the most frequent beginner bug.",
                    ],
                },
                {
                    "heading": "Making decisions",
                    "points": [
                        "Indent the lines of a block by the same amount, usually four spaces.",
                        "Combine conditions with and, or and not.",
                        "17 % 5 gives 2, which is handy for checking even and odd numbers.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "What is the difference between = and == in Python?", "answer": "A single = assigns a value to a variable, while == compares two values and gives True or False."},
                {"question": "Why does 'age: ' + 20 cause an error?", "answer": "Python cannot add a string and an integer; convert the number with str() first."},
                {"question": "Write the condition that checks whether a number n is even.", "answer": "n % 2 == 0"},
            ],
        },
        "chat": [
            "What is the difference between = and == ?",
            "Why does input() return a string?",
            "What does the percent operator do?",
        ],
    },
    {
        "course": "cs",
        "title": "Functions and Recursion",
        "attempts": 0,  # not practised yet, so the demo shows a mix of states
        "days_ago": 17,
        "lang": "en-IN",
        "transcript": (
            "Good afternoon. Today we move from writing short scripts to writing organised programs, and the tool for that is the function. "
            "A function is a named block of code that performs one task and can be reused whenever we need it. "
            "We define a function using the def keyword, followed by the name, parentheses and a colon. "
            "The code inside must be indented. For example, def greet with a parameter called name, and inside it we print hello followed by the name. "
            "Parameters are the names listed in the definition, and arguments are the actual values we pass when we call the function. "
            "People often mix these two words up, so remember that parameters belong to the definition and arguments belong to the call. "
            "A function can also give a result back using the return statement. "
            "The difference between print and return is important. Print only shows something on the screen, while return hands a value back so that the rest of the program can use it. "
            "If a function has no return statement, it returns None by default. "
            "We can give a parameter a default value, so the caller may skip it. For example, def power with base and exponent equal to two. "
            "Now let us talk about scope. A variable created inside a function is local, which means it exists only while the function runs. "
            "A variable created outside all functions is global and can be read from anywhere. "
            "As a good habit, avoid changing global variables from inside a function, and pass values in and return results instead. "
            "Now a more interesting idea, recursion. A recursive function is one that calls itself to solve a smaller version of the same problem. "
            "Every recursive function needs two parts. A base case, which stops the recursion, and a recursive case, which moves closer to the base case. "
            "The classic example is the factorial. The factorial of five is five times the factorial of four, and so on, until we reach the factorial of zero, which is one. "
            "That last statement is the base case. "
            "If we forget the base case, the function keeps calling itself forever, and Python stops it with a recursion error. "
            "Recursion is elegant for problems like trees and puzzles, but a simple loop is often faster and uses less memory. "
            "Please write a function that returns the sum of the digits of a number, once with a loop and once with recursion."
        ),
        "notes": {
            "title": "Functions and Recursion",
            "summary": "Functions package reusable code. They take parameters, can return values, and have local scope. Recursion is a technique where a function calls itself on a smaller problem until it reaches a base case.",
            "key_points": [
                "Define a function with def; call it with arguments.",
                "return gives a value back; print only displays it.",
                "Variables inside a function are local to that function.",
                "A recursive function needs a base case and a recursive case.",
            ],
            "concepts": [
                {"term": "Function", "definition": "A named block of code that performs one task and can be reused."},
                {"term": "Parameter", "definition": "A name in a function definition; the argument is the value passed in a call."},
                {"term": "Return value", "definition": "The result a function hands back using return; it is None if there is no return."},
                {"term": "Scope", "definition": "Where a variable can be used; local variables exist only inside their function."},
                {"term": "Recursion", "definition": "A technique where a function calls itself to solve a smaller version of the same problem."},
            ],
            "sections": [
                {
                    "heading": "Writing functions",
                    "points": [
                        "Use def, a name, parentheses and a colon, then indent the body.",
                        "Parameters can have default values, such as exponent = 2.",
                        "Without return, a function gives back None.",
                    ],
                },
                {
                    "heading": "Scope",
                    "points": [
                        "Local variables disappear when the function ends.",
                        "Global variables can be read anywhere.",
                        "Prefer passing values in and returning results over changing globals.",
                    ],
                },
                {
                    "heading": "Recursion",
                    "points": [
                        "factorial(n) = n x factorial(n - 1), with factorial(0) = 1 as the base case.",
                        "Without a base case Python raises a recursion error.",
                        "A loop is often faster and uses less memory than recursion.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "What is the difference between a parameter and an argument?", "answer": "A parameter is the name in the function definition; an argument is the value supplied when the function is called."},
                {"question": "What does a function return if it has no return statement?", "answer": "None."},
                {"question": "Why does every recursive function need a base case?", "answer": "The base case stops the calls; without it the function calls itself forever and causes a recursion error."},
            ],
        },
        "chat": [
            "What is the difference between print and return?",
            "What is a base case in recursion?",
            "What is the difference between a parameter and an argument?",
        ],
    },
    # ------------------------------------------------------------------ History
    {
        "course": "hist",
        "title": "The Revolt of 1857",
        "days_ago": 33,
        "lang": "en-IN",
        "transcript": (
            "Good morning. Today we study an event that many historians call the first major challenge to British rule in India, the revolt of 1857. "
            "Some call it the first war of independence, while the British called it the sepoy mutiny. The name itself is a matter of debate, and good historians weigh both views. "
            "To understand why it happened, we must look at the causes, which were political, economic, social and military. "
            "Politically, the East India Company had expanded through wars and through the doctrine of lapse. "
            "Under this policy, introduced by Lord Dalhousie, a princely state could be annexed if its ruler died without a natural heir. "
            "Satara, Jhansi and Nagpur were taken in this way, and Awadh was annexed in eighteen fifty six on the charge of misgovernance. "
            "Economically, heavy land revenue demands ruined peasants, and Indian handicrafts suffered from cheap British goods. "
            "Socially and religiously, many Indians feared interference in their customs, and rumours spread that the Company wanted to convert them. "
            "The immediate cause came from the army. The new Enfield rifle used cartridges that had to be bitten open, and a rumour spread that they were greased with cow and pig fat. "
            "This offended both Hindu and Muslim soldiers. "
            "In March eighteen fifty seven, Mangal Pandey attacked British officers at Barrackpore. "
            "On the tenth of May, the sepoys at Meerut rose in revolt, freed their imprisoned comrades and marched to Delhi. "
            "There they declared the elderly Mughal emperor, Bahadur Shah Zafar, as their leader. "
            "The revolt spread to Kanpur, Lucknow, Jhansi and Bihar. Important leaders included Rani Lakshmibai of Jhansi, Nana Sahib at Kanpur, Begum Hazrat Mahal at Lucknow and Kunwar Singh in Bihar. "
            "However, the revolt failed. It lacked a central leadership and a common plan, it did not spread across the whole country, and the British had better weapons and communication. "
            "Many Indian rulers, such as the Sikhs and the Nizam, remained loyal to the British. "
            "The consequences were very important. In eighteen fifty eight, the Government of India Act ended the rule of the East India Company, and power passed to the British Crown. "
            "The Queen's proclamation promised not to interfere in religious matters and to respect the rights of princes. "
            "The British also reorganised the army and followed a policy of divide and rule in the years that followed. "
            "For your assignment, write a one page note on why the revolt failed, using at least three points."
        ),
        "notes": {
            "title": "The Revolt of 1857",
            "summary": "The revolt of 1857 was a large scale uprising against East India Company rule, caused by political annexation, economic hardship, social fears and the greased cartridge rumour. It failed for lack of unity and leadership, but it ended Company rule and transferred power to the British Crown.",
            "key_points": [
                "Causes were political (doctrine of lapse), economic, social and military.",
                "The greased Enfield cartridge was the immediate trigger.",
                "The revolt began at Meerut on 10 May 1857 and spread to Delhi, Kanpur, Lucknow and Jhansi.",
                "In 1858 power passed from the East India Company to the British Crown.",
            ],
            "concepts": [
                {"term": "Doctrine of lapse", "definition": "A policy under which a princely state was annexed if its ruler died without a natural heir."},
                {"term": "Sepoy", "definition": "An Indian soldier serving in the army of the East India Company."},
                {"term": "Enfield rifle", "definition": "The new rifle whose greased cartridges offended Hindu and Muslim soldiers and triggered the revolt."},
                {"term": "Bahadur Shah Zafar", "definition": "The last Mughal emperor, declared leader of the revolt at Delhi."},
                {"term": "Government of India Act, 1858", "definition": "The law that ended East India Company rule and transferred power to the Crown."},
            ],
            "sections": [
                {
                    "heading": "Causes",
                    "points": [
                        "Satara, Jhansi, Nagpur and Awadh were annexed.",
                        "Heavy land revenue and cheap British goods hurt peasants and artisans.",
                        "Rumours of religious interference raised fear and anger.",
                    ],
                },
                {
                    "heading": "Course and leaders",
                    "points": [
                        "Mangal Pandey acted at Barrackpore in March 1857.",
                        "Sepoys at Meerut revolted and marched to Delhi.",
                        "Leaders: Rani Lakshmibai, Nana Sahib, Begum Hazrat Mahal and Kunwar Singh.",
                    ],
                },
                {
                    "heading": "Failure and results",
                    "points": [
                        "No central leadership and limited geographic spread.",
                        "Several Indian rulers stayed loyal to the British.",
                        "The Queen's proclamation promised religious non interference.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "What was the doctrine of lapse and who introduced it?", "answer": "A policy introduced by Lord Dalhousie under which a state was annexed if its ruler died without a natural heir."},
                {"question": "Give two reasons why the revolt of 1857 failed.", "answer": "It lacked central leadership and a common plan, and it did not spread across the whole country; many rulers also supported the British."},
                {"question": "What was the main result of the revolt in 1858?", "answer": "East India Company rule ended and power passed to the British Crown."},
            ],
        },
        "chat": [
            "What was the doctrine of lapse?",
            "Why did the revolt of 1857 fail?",
            "Who were the main leaders of the revolt?",
            "What was the doctrine of lapse?",
        ],
    },
    {
        "course": "hist",
        "title": "Gandhi and the Non-Cooperation Movement",
        "days_ago": 20,
        "lang": "en-IN",
        "transcript": (
            "Good morning everyone. Today we study the moment when the freedom struggle became a mass movement, with Mahatma Gandhi as its leader. "
            "Gandhi returned to India from South Africa in nineteen fifteen. There he had developed two powerful ideas, satyagraha and ahimsa. "
            "Satyagraha means holding firmly to truth and resisting injustice through peaceful means. Ahimsa means non violence. "
            "After returning, Gandhi led local struggles in Champaran in Bihar for indigo farmers, in Kheda in Gujarat for peasants, and in Ahmedabad for mill workers. "
            "These experiences gave him a deep connection with ordinary Indians. "
            "Then came the Rowlatt Act of nineteen nineteen, which allowed the government to jail people without trial. "
            "Gandhi called for a nationwide protest. On the thirteenth of April, nineteen nineteen, General Dyer's troops fired on an unarmed crowd at Jallianwala Bagh in Amritsar. "
            "Hundreds were killed, and the massacre shocked the whole country. "
            "At the same time, Indian Muslims were angry about the harsh treatment of the Ottoman Caliph after the First World War, which gave rise to the Khilafat movement. "
            "Gandhi saw a chance to unite Hindus and Muslims in a common cause. "
            "In nineteen twenty, the Congress adopted the Non-Cooperation Movement at its sessions in Calcutta and Nagpur. "
            "The programme had two parts. First, give up cooperation with the government. People returned titles and honours, boycotted courts, schools and foreign cloth, and refused to join the elections. "
            "Second, a constructive programme. People spun khadi on the charkha, set up national schools and promoted Hindu Muslim unity. "
            "The movement grew rapidly. Lawyers such as Motilal Nehru and Chittaranjan Das gave up their practice, and students left government colleges. "
            "Then, in February nineteen twenty two, a crowd set fire to a police station at Chauri Chaura in Uttar Pradesh, and twenty two policemen died. "
            "Gandhi was deeply disturbed by this violence, and he suspended the movement, even though many leaders disagreed. "
            "He was arrested soon after and sentenced to six years in prison. "
            "Although it ended suddenly, the movement was a turning point. It brought peasants, workers, women and students into politics for the first time, and it spread nationalist feeling to small towns and villages. "
            "Please prepare a short note comparing the Non-Cooperation Movement with the revolt of 1857."
        ),
        "notes": {
            "title": "Gandhi and the Non-Cooperation Movement",
            "summary": "Under Gandhi's leadership, the freedom struggle became a mass movement. The Non-Cooperation Movement (1920 to 1922) used peaceful refusal to cooperate with the government, and was suspended after violence at Chauri Chaura.",
            "key_points": [
                "Gandhi brought satyagraha and ahimsa from South Africa.",
                "The Rowlatt Act, Jallianwala Bagh and the Khilafat issue led to the movement.",
                "The movement combined boycotts with a constructive programme of khadi and national schools.",
                "It was called off in 1922 after the violence at Chauri Chaura.",
            ],
            "concepts": [
                {"term": "Satyagraha", "definition": "Holding firmly to truth and resisting injustice by peaceful means."},
                {"term": "Ahimsa", "definition": "The principle of non violence."},
                {"term": "Rowlatt Act", "definition": "A 1919 law that allowed imprisonment without trial."},
                {"term": "Khilafat movement", "definition": "A movement by Indian Muslims in support of the Ottoman Caliph, which Gandhi linked with the national struggle."},
                {"term": "Non-Cooperation Movement", "definition": "The 1920 to 1922 campaign of boycotting British institutions and goods to force change peacefully."},
            ],
            "sections": [
                {
                    "heading": "Gandhi before 1920",
                    "points": [
                        "Champaran for indigo farmers, Kheda for peasants and Ahmedabad for mill workers.",
                        "The Rowlatt Act sparked nationwide protest.",
                        "The Jallianwala Bagh massacre on 13 April 1919 shocked the country.",
                    ],
                },
                {
                    "heading": "The movement",
                    "points": [
                        "Titles were returned and courts, schools and foreign cloth boycotted.",
                        "Constructive work included spinning khadi and setting up national schools.",
                        "Leaders such as Motilal Nehru and C. R. Das gave up legal practice.",
                    ],
                },
                {
                    "heading": "End and impact",
                    "points": [
                        "Chauri Chaura in February 1922 led Gandhi to suspend the movement.",
                        "Gandhi was arrested and sentenced to six years.",
                        "Peasants, workers, women and students entered politics in large numbers.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "What were the two main parts of the Non-Cooperation programme?", "answer": "Refusing to cooperate with the government through boycotts, and a constructive programme such as khadi, national schools and Hindu Muslim unity."},
                {"question": "Why did Gandhi suspend the movement in 1922?", "answer": "A mob burned a police station at Chauri Chaura and killed policemen, and Gandhi believed the movement had become violent."},
                {"question": "Why was the movement a turning point?", "answer": "It turned the freedom struggle into a mass movement by bringing peasants, workers, women and students into politics."},
            ],
        },
        "chat": [
            "What is satyagraha?",
            "Why did Gandhi stop the Non-Cooperation Movement?",
            "How was the Khilafat movement connected to it?",
        ],
    },
    # ------------------------------------------------------------------ Economics
    {
        "course": "eco",
        "title": "Demand, Supply and Market Equilibrium",
        "attempts": 0,  # not practised yet, so the demo shows a mix of states
        "days_ago": 14,
        "lang": "en-IN",
        "transcript": (
            "Good morning, everyone. Today we study the idea that sits at the heart of microeconomics, how demand and supply together decide prices. "
            "Let us begin with demand. The quantity demanded of a good is the amount that consumers are willing and able to buy at a given price. "
            "The law of demand says that, other things remaining equal, when the price of a good rises, the quantity demanded falls, and when the price falls, the quantity demanded rises. "
            "If we plot price against quantity, the demand curve slopes downward from left to right. "
            "Why? Partly because of the substitution effect, as people switch to cheaper alternatives, and partly because of the income effect, as a lower price makes people feel better off. "
            "Please be careful with one distinction. A change in the price of the good itself causes a movement along the demand curve. "
            "A change in anything else, such as income, tastes or the price of related goods, shifts the whole curve. "
            "For example, if incomes rise, demand for a normal good increases and the curve shifts to the right. "
            "Now supply. The law of supply says that, other things equal, a higher price encourages producers to supply a larger quantity. "
            "So the supply curve slopes upward. Producers earn more per unit at a higher price, so it becomes worthwhile to produce more. "
            "Again, a change in price moves us along the supply curve, while a change in the cost of inputs or in technology shifts the curve. "
            "Better technology lowers costs, and the supply curve shifts to the right. "
            "Now we bring them together. The market equilibrium is the price at which the quantity demanded equals the quantity supplied. "
            "On the graph it is the point where the two curves meet. "
            "If the price is above equilibrium, suppliers produce more than buyers want, and we get a surplus. Sellers then cut prices to clear their stock. "
            "If the price is below equilibrium, buyers want more than is available, and we get a shortage. Prices then tend to rise. "
            "In this way the market moves toward equilibrium without anyone planning it. "
            "Consider the price of onions. If bad rains destroy part of the harvest, supply shifts to the left, a shortage appears at the old price, and the new equilibrium price is higher. "
            "A final concept for today is elasticity, which measures how strongly quantity responds to a change in price. "
            "Demand for necessities like salt is inelastic, because people buy about the same amount whatever the price. Demand for luxuries is usually elastic. "
            "For homework, draw a supply and demand diagram showing the effect of a rise in consumer income on the price of cars."
        ),
        "notes": {
            "title": "Demand, Supply and Market Equilibrium",
            "summary": "The law of demand and the law of supply explain how prices are set. Equilibrium occurs where quantity demanded equals quantity supplied; prices above or below it create surpluses or shortages that push the market back toward equilibrium.",
            "key_points": [
                "Law of demand: as price rises, quantity demanded falls, other things equal.",
                "Law of supply: as price rises, quantity supplied rises, other things equal.",
                "A price change moves us along a curve; other factors shift the whole curve.",
                "At equilibrium, quantity demanded equals quantity supplied.",
            ],
            "concepts": [
                {"term": "Law of demand", "definition": "When the price of a good rises, the quantity demanded falls, other things remaining equal."},
                {"term": "Law of supply", "definition": "When the price of a good rises, the quantity supplied rises, other things remaining equal."},
                {"term": "Equilibrium price", "definition": "The price at which quantity demanded equals quantity supplied."},
                {"term": "Surplus", "definition": "A situation where quantity supplied exceeds quantity demanded because the price is above equilibrium."},
                {"term": "Price elasticity", "definition": "A measure of how strongly the quantity demanded responds to a change in price."},
            ],
            "sections": [
                {
                    "heading": "Demand",
                    "points": [
                        "The demand curve slopes downward because of substitution and income effects.",
                        "A rise in income shifts demand for a normal good to the right.",
                        "Tastes and the prices of related goods also shift demand.",
                    ],
                },
                {
                    "heading": "Supply",
                    "points": [
                        "The supply curve slopes upward because higher prices make production more worthwhile.",
                        "Better technology lowers costs and shifts supply to the right.",
                        "Higher input costs shift supply to the left.",
                    ],
                },
                {
                    "heading": "Equilibrium in action",
                    "points": [
                        "Above equilibrium there is a surplus and prices tend to fall.",
                        "Below equilibrium there is a shortage and prices tend to rise.",
                        "Bad rains shift the supply of onions left and raise the equilibrium price.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "What is the difference between a movement along the demand curve and a shift of the curve?", "answer": "A change in the good's own price causes a movement along the curve; a change in income, tastes or related prices shifts the whole curve."},
                {"question": "What happens in a market when the price is above equilibrium?", "answer": "There is a surplus, so sellers lower prices until the market returns to equilibrium."},
                {"question": "Why is the demand for salt inelastic?", "answer": "Because it is a necessity; people buy about the same amount whatever the price."},
            ],
        },
        "chat": [
            "What is the difference between a shift and a movement along the demand curve?",
            "What is a surplus?",
            "What is elasticity?",
            "What is a surplus?",
        ],
    },
]


# ---------------------------------------------------------------------------
# Extend every lecture to a realistic 10 to 15 minute length. The base text above
# is the opening; the extension files add the detailed second half, a closing and
# extra notes. The base's own closing sentence is replaced by the new closing.
# ---------------------------------------------------------------------------
def _extend_lectures():
    from app.demo_more_bio import MORE as bio
    from app.demo_more_extra import MORE as extra
    from app.demo_more_humanities import MORE as humanities
    from app.demo_more_stem import MORE as stem

    extensions = {**bio, **stem, **humanities, **extra}
    for lec in LECTURES:
        ext = extensions.get(lec["title"])
        if not ext or lec.get("_extended"):
            continue
        lec["_extended"] = True
        text = lec["transcript"]
        cut = text.rfind(ext["cut_at"])
        if cut < 0:
            raise ValueError(f"cut_at not found for {lec['title']!r}")
        lec["transcript"] = text[:cut] + ext["more"] + ext["closing"]
        for key, items in ext.get("notes_extra", {}).items():
            lec["notes"][key] = list(lec["notes"].get(key, [])) + list(items)


_extend_lectures()


# Three more courses (Chemistry, Mathematics, English) so the dashboard shows a full grid of eight.
from app.demo_extra_courses import COURSES as _EXTRA_COURSES  # noqa: E402
from app.demo_extra_courses import LECTURES as _EXTRA_LECTURES  # noqa: E402

COURSES.extend(_EXTRA_COURSES)
LECTURES.extend(_EXTRA_LECTURES)

_extend_lectures()  # second pass picks up the extra courses (already-extended lectures are skipped)
