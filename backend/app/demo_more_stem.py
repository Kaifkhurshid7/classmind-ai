"""Extended content for the Physics and Python lectures."""

MORE = {
    "Newton's Laws of Motion": {
        "cut_at": "For homework, solve the five problems",
        "more": (
            "Let us now work through each law more carefully, with examples and calculations, because physics is learned by solving problems. "
            "Begin with the first law and the idea of net force. "
            "Many forces can act on an object at the same time, and what matters is their combined effect, which we call the net force or resultant force. "
            "If a book rests on a table, gravity pulls it down and the table pushes it up. These two forces are equal and opposite, so the net force is zero, and the book stays at rest. "
            "Now a car moving at a steady speed on a straight road. The engine pushes forward, and friction and air resistance push backward. "
            "If the forward and backward forces are equal, the net force is zero, and the car keeps a constant velocity. "
            "This surprises many students. They think that a moving object must always have a force pushing it forward. "
            "Aristotle believed this, and people accepted it for nearly two thousand years. "
            "Galileo and then Newton showed that a force is needed only to change the motion, not to keep it going. "
            "A hockey puck slides far on smooth ice precisely because there is very little friction to change its motion. "
            "Now the second law in more depth. Written in full, it says that the net force equals mass times acceleration. "
            "Let us do a three step method for every problem. "
            "Step one, draw a free body diagram, a simple sketch of the object with arrows for every force acting on it. "
            "Step two, find the net force along the direction of motion, adding forces in one direction and subtracting those in the opposite direction. "
            "Step three, divide the net force by the mass to get the acceleration. "
            "Here is an example. A car of mass one thousand kilograms is pushed forward by its engine with a force of three thousand newtons, while friction and air resistance together oppose it with one thousand newtons. "
            "The net force is three thousand minus one thousand, which is two thousand newtons. "
            "The acceleration is two thousand divided by one thousand, so two metres per second squared. "
            "If the car starts from rest, after five seconds its velocity will be two times five, which is ten metres per second. "
            "A second example involving weight. A box of mass ten kilograms hangs from a rope. What is the tension in the rope when the box is at rest? "
            "The weight is mass times g, so ten times ten, which is one hundred newtons downward. "
            "For the box to remain at rest, the tension must balance it, so the tension is one hundred newtons upward. "
            "Now suppose someone pulls the rope upward so that the box accelerates upward at two metres per second squared. "
            "The net force upward equals mass times acceleration, so ten times two, which is twenty newtons. "
            "The tension must therefore be the weight plus twenty, which is one hundred and twenty newtons. "
            "That is why a rope can break when you jerk a heavy load upward, because the tension becomes larger than the weight. "
            "A lift gives the same effect. When a lift starts moving up, you feel heavier, and when it starts moving down, you feel lighter. "
            "Now the third law again, with real examples of how it works. "
            "When you walk, your foot pushes backward on the ground, and the ground pushes you forward. "
            "On a slippery floor your foot cannot push hard on the ground, so the reaction force is small and you cannot move forward easily. "
            "When a swimmer pushes the water backward, the water pushes the swimmer forward. "
            "When a gun fires a bullet, the gun exerts a large force on the bullet, and the bullet exerts an equal force back on the gun, which is why the gun recoils. "
            "The gun does not move as fast as the bullet, and the reason comes from the second law. The forces are equal, but the gun has a much larger mass, so its acceleration is much smaller. "
            "This is a good example to show that you really need all three laws together. "
            "Now one more idea connected to the first two laws, momentum. Momentum is mass times velocity, and it is measured in kilogram metres per second. "
            "Newton actually wrote his second law as force equals the rate of change of momentum. "
            "A heavy truck moving slowly can have the same momentum as a light car moving fast. "
            "That is why it is hard to stop a heavy vehicle, and why safety features such as airbags and crumple zones exist. "
            "When a car crashes, its momentum must change to zero. If this change takes a longer time, the force on the passengers is smaller. "
            "An airbag increases the time of the collision, so the force on the passenger is reduced. "
            "Catching a cricket ball is the same idea. A good fielder moves the hands backward while catching, to lengthen the time and reduce the force, and that protects the fingers. "
            "Let me also correct two common misconceptions. "
            "First, some students say that heavier objects fall faster. In air, a feather falls slowly because of air resistance, but in a vacuum a feather and a hammer fall together. "
            "Astronauts on the moon demonstrated this, and the acceleration due to gravity does not depend on the mass of the falling object. "
            "Second, some students believe that there must be a force in the direction of motion. We have seen that this is not true. "
            "Only a change in motion needs a net force. "
            "To summarise this lecture, we learned how to find the net force, how to solve problems with a free body diagram, how tension changes when a load accelerates, why action and reaction pairs allow walking and swimming, and how momentum explains vehicle safety. "
        ),
        "closing": (
            "For homework, solve the five problems on page forty and draw a free body diagram for each. "
            "Also write two everyday examples of each of the three laws, in your own words. Thank you."
        ),
        "notes_extra": {
            "key_points": [
                "Net force is the combined effect of all forces; a force is needed only to change motion, not to maintain it.",
                "Solve problems in three steps: free body diagram, net force, then a = F / m.",
                "Momentum is mass times velocity; longer collision times mean smaller forces (airbags, crumple zones).",
                "All objects fall with the same acceleration in a vacuum, regardless of mass.",
            ],
            "concepts": [
                {"term": "Net force", "definition": "The combined effect of all the forces acting on an object."},
                {"term": "Free body diagram", "definition": "A sketch of an object showing every force on it as an arrow."},
                {"term": "Tension", "definition": "The pulling force transmitted through a rope or string."},
                {"term": "Momentum", "definition": "Mass multiplied by velocity, measured in kilogram metres per second."},
            ],
            "sections": [
                {
                    "heading": "Worked examples",
                    "points": [
                        "1000 kg car, 3000 N forward and 1000 N resistance: net force 2000 N, a = 2 m/s squared.",
                        "A 10 kg box at rest hangs with tension 100 N; accelerating upward at 2 m/s squared needs 120 N.",
                        "A lift feels heavier when starting upward and lighter when starting downward.",
                    ],
                },
                {
                    "heading": "Third law in action",
                    "points": [
                        "Walking: the foot pushes back on the ground and the ground pushes you forward.",
                        "A gun recoils because the bullet pushes back on it, but its large mass gives a small acceleration.",
                        "A swimmer moves forward by pushing water backward.",
                    ],
                },
                {
                    "heading": "Momentum and safety",
                    "points": [
                        "Force equals the rate of change of momentum.",
                        "Airbags lengthen the stopping time and reduce the force on passengers.",
                        "A fielder draws the hands back when catching a ball to reduce the force.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "Why does an airbag reduce injury in a collision?", "answer": "It lengthens the time over which the passenger's momentum changes, so the force on the passenger is smaller."},
                {"question": "A 10 kg box on a rope accelerates upward at 2 m/s squared. What is the tension (g = 10)?", "answer": "T = m(g + a) = 10 x 12 = 120 newtons."},
            ],
        },
    },
    "Work, Energy and Power": {
        "cut_at": "Please revise the formulas and attempt",
        "more": (
            "Now let us go deeper, and look at how these ideas are used to solve problems that appear in examinations and in real life. "
            "Start with work when the force is not along the direction of motion. "
            "Suppose you pull a box across the floor using a rope that makes an angle with the floor. "
            "Only the part of the force that is along the direction of motion does any work. "
            "The work done equals force times displacement times the cosine of the angle between them. "
            "If the angle is zero, the cosine is one, and the work is simply force times displacement. "
            "If the angle is ninety degrees, the cosine is zero, and no work is done, which matches what we said about gravity acting on a person walking on level ground. "
            "Here is an example. A force of fifty newtons pulls a box through four metres at an angle of sixty degrees to the floor. "
            "The cosine of sixty degrees is one half. So the work done is fifty times four times one half, which is one hundred joules. "
            "Work can also be negative. When friction opposes the motion, the angle between force and displacement is one hundred and eighty degrees, the cosine is minus one, and the work done by friction is negative. "
            "Negative work removes energy from the moving object, and that is how brakes stop a car. "
            "Next, the work energy theorem. It says that the net work done on an object equals the change in its kinetic energy. "
            "Let us test it. A car of mass one thousand kilograms is moving at ten metres per second, and the driver applies the brakes. "
            "The initial kinetic energy is half times one thousand times ten squared, which is fifty thousand joules. "
            "To stop the car, the brakes must do negative work of fifty thousand joules. "
            "If the braking force is five thousand newtons, the stopping distance is fifty thousand divided by five thousand, which is ten metres. "
            "Now see what happens if the car is travelling twice as fast, at twenty metres per second. "
            "The kinetic energy becomes half times one thousand times twenty squared, which is two hundred thousand joules, four times as much. "
            "With the same braking force, the stopping distance becomes forty metres, four times as far. "
            "This is why speed limits matter so much near schools, and why drivers must keep a larger gap at higher speeds. "
            "Now more on potential energy and conservation. Suppose a ball of mass two kilograms is dropped from a height of five metres. Take g as ten. "
            "At the top, it has potential energy equal to mass times g times height, which is two times ten times five, so one hundred joules, and no kinetic energy. "
            "Just before it hits the ground, all the energy has become kinetic. So half times two times v squared equals one hundred, and v squared equals one hundred. "
            "The speed is ten metres per second. "
            "Notice that we did not need the time of fall, or any complicated equation of motion. Energy conservation gives the answer in one line. "
            "That is the power of this method. "
            "At the halfway point, at two and a half metres, the potential energy is fifty joules and the kinetic energy is also fifty joules. "
            "At every point, the sum of the two stays at one hundred joules, if we ignore air resistance. "
            "Now let us link this to energy resources. "
            "A hydroelectric power station stores water behind a dam. The water has gravitational potential energy. "
            "When released, it flows down through pipes, and the potential energy turns into kinetic energy, which turns a turbine and then a generator, producing electrical energy. "
            "A wind turbine converts the kinetic energy of moving air to electrical energy. "
            "A solar panel converts light energy directly into electrical energy. "
            "In every case, the energy is transformed, not created. "
            "We also need the idea of efficiency. No machine is perfect, because some energy is always wasted as heat and sound. "
            "Efficiency is the useful output energy divided by the total input energy, usually given as a percentage. "
            "An ordinary filament bulb converts only about five percent of the electrical energy into light, and the rest becomes heat. "
            "An LED bulb is much more efficient, which is why switching to LED lamps saves electricity. "
            "Let me work out one example about power in daily life. "
            "A ceiling fan rated at seventy five watts runs for eight hours a day. How much energy does it use in a day? "
            "Energy equals power times time. Seventy five watts is zero point zero seven five kilowatts, and eight hours gives zero point six kilowatt hours. "
            "The kilowatt hour is the unit used in your electricity bill, and one kilowatt hour is commonly called one unit of electricity. "
            "If the fan runs for thirty days, it uses eighteen units. "
            "A good habit is to check the power rating on appliances at home, and to calculate how many units each uses. "
            "Finally, a few tips for solving problems. "
            "Always write the formula first, substitute the numbers with units, and check that your final unit is correct. Joules for work and energy, watts for power. "
            "Check whether the question needs energy conservation or the work energy theorem, because both save a lot of time. "
            "And be careful with squares, because speed is squared in the kinetic energy formula. "
            "To summarise this lecture, we saw how to handle work at an angle, how negative work stops a vehicle, the work energy theorem, energy conservation for a falling ball, efficiency, and the unit of electricity. "
        ),
        "closing": (
            "Please revise the formulas and attempt the numerical problems at the end of the chapter. "
            "Also calculate the monthly electricity units used by three appliances in your home and bring the results to the next class. Thank you."
        ),
        "notes_extra": {
            "key_points": [
                "Work = F x d x cos(angle); no work is done when the force is perpendicular to the motion.",
                "Work energy theorem: net work equals the change in kinetic energy.",
                "Doubling a vehicle's speed quadruples its stopping distance for the same braking force.",
                "Efficiency = useful output energy / total input energy; LED lamps are far more efficient than filament bulbs.",
            ],
            "concepts": [
                {"term": "Work energy theorem", "definition": "The net work done on an object equals its change in kinetic energy."},
                {"term": "Efficiency", "definition": "The fraction of input energy that becomes useful output energy."},
                {"term": "Kilowatt hour", "definition": "The unit of electrical energy on a bill, equal to one unit of electricity."},
                {"term": "Negative work", "definition": "Work done by a force opposing motion, which removes energy, as friction does."},
            ],
            "sections": [
                {
                    "heading": "Worked examples",
                    "points": [
                        "50 N at 60 degrees over 4 m does 50 x 4 x 0.5 = 100 J of work.",
                        "A 1000 kg car at 10 m/s has 50,000 J of kinetic energy; a 5000 N braking force stops it in 10 m.",
                        "A 2 kg ball dropped from 5 m reaches 10 m/s, found directly from energy conservation.",
                    ],
                },
                {
                    "heading": "Energy in the real world",
                    "points": [
                        "Hydroelectric stations turn gravitational potential energy into electricity.",
                        "Wind turbines and solar panels transform kinetic and light energy.",
                        "Energy is always transformed, never created.",
                    ],
                },
                {
                    "heading": "Electricity at home",
                    "points": [
                        "A 75 W fan used for 8 hours consumes 0.6 kWh (units) per day.",
                        "Energy = power x time.",
                        "Check appliance ratings to estimate your monthly units.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "Why is the stopping distance four times larger when speed doubles?", "answer": "Kinetic energy depends on speed squared, so the braking force must do four times the work, over four times the distance."},
                {"question": "A 2 kg ball falls from 5 m. Find its speed just before landing (g = 10).", "answer": "mgh = 100 J = half m v squared, so v = 10 m/s."},
            ],
        },
    },
    "Variables, Data Types and Decisions": {
        "cut_at": "For practice, write a program that asks",
        "more": (
            "Now that we have met the basics, let us write real programs and look at the details that trip up beginners. "
            "First, strings, since almost every program works with text. "
            "A string is a sequence of characters, and each character has a position called an index, starting from zero. "
            "If name equals the word python, then name with the index zero in square brackets gives the letter p, and index one gives y. "
            "A negative index counts from the end, so index minus one gives the last letter, n. "
            "We can also take a slice of the string. Name with one colon four in square brackets gives the characters from index one up to, but not including, index four, which is yth. "
            "Strings have many useful built in methods. Upper turns all letters to capitals, lower makes them small, strip removes extra spaces from both ends, and replace swaps one piece of text for another. "
            "The len function tells us how many characters a string contains. "
            "Another very handy tool is the f string. You put the letter f before the opening quote, and then you can place variables inside curly braces within the text. "
            "For example, print f quote hello, curly name, you are curly age years old. This prints a neat sentence and saves you from converting numbers by hand. "
            "Next, let us practise with numbers and see the difference between integer division and normal division. "
            "Seventeen divided by five gives three point four. Seventeen double slash five gives three, which is the quotient. And seventeen percent five gives two, which is the remainder. "
            "We can use these to split a total number of minutes into hours and minutes. "
            "If the total is one hundred and thirty minutes, then the hours are one hundred and thirty double slash sixty, which is two, and the minutes are one hundred and thirty percent sixty, which is ten. "
            "The power operator is double star, so two double star three gives eight. "
            "Now more on decisions. Let me build a complete example, a program that gives a grade. "
            "We ask the user for marks and convert the answer to an integer. "
            "If marks is greater than or equal to ninety, we print grade A. Otherwise, if marks is at least seventy five, we print grade B. Otherwise, if marks is at least sixty, we print grade C. Otherwise, if marks is at least forty, we print grade D. Else we print fail. "
            "The order of the conditions is very important. Python checks from the top and stops at the first true condition. "
            "If we had written the check for forty first, then a student with ninety five marks would be graded D, because ninety five is also greater than forty. "
            "So always put the most specific or the highest condition first. "
            "Now logical operators. The and operator is true only if both conditions are true. The or operator is true if at least one is true. The not operator reverses a condition. "
            "For example, to check whether a year is a leap year, we need that the year is divisible by four, and that it is either not divisible by one hundred or is divisible by four hundred. "
            "Written in Python, this is year percent four double equals zero, and, open bracket, year percent one hundred not equal to zero, or, year percent four hundred double equals zero, close bracket. "
            "Test it with two thousand, which is a leap year, one nine hundred, which is not, and two thousand four, which is. "
            "Testing your program with several inputs, including unusual ones, is a habit of every good programmer. "
            "Now let us talk about errors, because everybody gets them, including professionals. "
            "There are three kinds. A syntax error happens when you break the rules of the language, such as forgetting a colon after an if statement. Python refuses to run and points to the line. "
            "A runtime error happens while the program is running, such as dividing by zero or converting the word hello to an integer. "
            "A logic error is the most difficult, because the program runs without complaint but gives the wrong answer, for example using the wrong operator or putting the conditions in the wrong order. "
            "To find logic errors, print the values of your variables at different points and compare them with what you expect. "
            "Read error messages from the bottom, because the last line tells you the type of error and the line above shows where it happened. "
            "Also, write comments with the hash symbol to explain your thinking. Comments are ignored by Python, but they help you and others to read the code later. "
            "Good variable names are also a kind of documentation. A name like total marks is much clearer than a single letter x. "
            "Python programmers usually write names in lowercase with underscores between words, a style called snake case. "
            "A word about the input function again. Because input always returns text, if you ask for two numbers and add them without converting, Python will join the two pieces of text and give you, for example, the text one two instead of the number three. "
            "This is one of the most common beginner surprises, and now you know how to avoid it, by converting with int or float. "
            "To summarise, today we covered string indexing, slicing and methods, f strings, integer division and remainders, a complete grading program, the order of conditions, logical operators, the three kinds of errors, and good habits such as comments and clear names. "
        ),
        "closing": (
            "For practice, write a program that asks for a number and prints whether it is positive, negative or zero. "
            "Then write a second program that asks for a year and says whether it is a leap year. We will check both together next class. Thank you."
        ),
        "notes_extra": {
            "key_points": [
                "Strings are indexed from 0; negative indices count from the end and slices use start:stop.",
                "f-strings insert variables directly into text, avoiding manual type conversion.",
                "Order matters in an if / elif chain: Python stops at the first true condition.",
                "Syntax, runtime and logic errors need different debugging approaches.",
            ],
            "concepts": [
                {"term": "Index", "definition": "The position of a character in a string, starting from zero."},
                {"term": "Slicing", "definition": "Taking part of a string with name[start:stop]; the stop index is excluded."},
                {"term": "f-string", "definition": "A string prefixed with f that lets you place variables in curly braces inside the text."},
                {"term": "Logic error", "definition": "A mistake that lets a program run but produce the wrong answer."},
            ],
            "sections": [
                {
                    "heading": "Working with text and numbers",
                    "points": [
                        "name.upper(), lower(), strip() and replace() are common string methods.",
                        "// gives the quotient, % the remainder and ** the power.",
                        "130 minutes is 130 // 60 = 2 hours and 130 % 60 = 10 minutes.",
                    ],
                },
                {
                    "heading": "Building decisions",
                    "points": [
                        "A grade program checks the highest boundary first (90, 75, 60, 40).",
                        "and, or and not combine conditions; a leap year uses all three.",
                        "Test with ordinary and unusual inputs such as 2000, 1900 and 2004.",
                    ],
                },
                {
                    "heading": "Debugging habits",
                    "points": [
                        "Read the error message from the bottom up.",
                        "Print variables to find logic errors.",
                        "Use comments and clear snake_case names to make code readable.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "Why must the highest grade boundary be tested first in an if / elif chain?", "answer": "Python stops at the first true condition, so a high mark would otherwise match a lower grade check first."},
                {"question": "What does input('1') + input('2') give if the user types 1 and 2?", "answer": "The text '12', because input returns strings and + joins them; convert with int() to add numerically."},
            ],
        },
    },
    "Functions and Recursion": {
        "cut_at": "Please write a function that returns the sum",
        "more": (
            "Let us now explore functions more deeply, and see how they make programs shorter, clearer and easier to fix. "
            "Start with the reason we use functions at all. "
            "Imagine you need to calculate the area of a circle in five different places in your program. "
            "Without a function, you copy the same lines five times, and if you find a mistake you must correct all five copies. "
            "With a function, you write the logic once, give it a name, and call it wherever you need it. "
            "This principle is called do not repeat yourself, and it is one of the most important ideas in programming. "
            "Here is the function. def area of circle, with a parameter called radius, and the line return three point one four one five nine times radius times radius. "
            "When we call area of circle with the value five, we receive seventy eight point five three nine seven five. "
            "A function can have more than one parameter. For example, def rectangle area with length and width, which returns length times width. "
            "When we call it, we can pass arguments by position, so rectangle area of four comma six, or by name, so rectangle area of width equals six comma length equals four. "
            "Naming the arguments makes the call easier to read, and the order no longer matters. "
            "Functions can also return more than one value. In Python, we simply separate the values with commas, and the function actually returns a tuple. "
            "For example, a function that takes a list of marks and returns the minimum, the maximum and the average. "
            "We can then unpack the results into three variables in a single line. "
            "Now let us understand scope with a small experiment. "
            "Suppose we have a global variable count equal to ten. Inside a function, we write count equals count plus one. "
            "Python raises an error, because the assignment makes count a local variable, and we are trying to read it before it has a value. "
            "To change a global variable, we must declare it with the global keyword, but as I said before, it is usually better to pass the value in and return the new value. "
            "That keeps each function independent, and easier to test. "
            "A good function does one thing, has a clear name that starts with a verb, such as calculate average or find largest, and is short enough to read on one screen. "
            "We should also add a docstring, a short text in triple quotes on the first line of the function, which explains what it does. "
            "Python can show this text with the help function, and tools use it to document your code. "
            "Now let us return to recursion and study it with a second example, because it takes practice to become comfortable. "
            "We want to add the numbers from one up to n. We can think of it in two ways. "
            "With a loop, we start the total at zero and add each number in turn. "
            "With recursion, we say the sum up to n is n plus the sum up to n minus one, and the sum up to zero is zero. "
            "In code, def sum to n, with parameter n. If n equals zero, return zero. Otherwise return n plus sum to n minus one. "
            "Let us trace sum to three. It returns three plus sum to two. Sum to two returns two plus sum to one. Sum to one returns one plus sum to zero. Sum to zero returns zero. "
            "Now the answers come back up the chain. One plus zero is one. Two plus one is three. Three plus three is six. "
            "So sum to three equals six. This idea of calls waiting on each other is stored by Python in a structure called the call stack. "
            "Each new call is placed on top of the stack, and when a call finishes, it is removed. "
            "If the recursion is too deep, the stack becomes full, and Python reports a recursion error. By default, the limit is about one thousand calls. "
            "A third classic example is the Fibonacci sequence, where every number is the sum of the two before it. Zero, one, one, two, three, five, eight. "
            "A recursive function for it is very short, return fib of n minus one plus fib of n minus two, with base cases for zero and one. "
            "But this simple version is very slow for large n, because it repeats the same calculations again and again. "
            "Fib of five calls fib of four and fib of three, and fib of four calls fib of three again, and so on. "
            "The number of calls roughly doubles each time n increases by one. "
            "We can fix this with a technique called memoisation, where we store each result in a dictionary and reuse it. "
            "The lesson here is that a beautiful solution is not always an efficient one. "
            "When should you use recursion? It is natural for problems that are defined in terms of smaller copies of themselves, such as searching folders inside folders, solving puzzles like the Tower of Hanoi, or working with tree shaped data. "
            "For simple counting and summing, a loop is usually better. "
            "Let me end with how professionals test functions. "
            "They write a few small checks using the assert statement, such as assert sum to n of three equals six. "
            "If the function returns something different, the program stops immediately and shows the failing check. "
            "Testing small functions one at a time is much easier than testing one large program. "
            "To recap, today we saw why functions avoid repetition, how to use several parameters and return values, how scope works, what a good function looks like, how recursion is traced on the call stack, why naive Fibonacci is slow, and how to test with assert. "
        ),
        "closing": (
            "Please write a function that returns the sum of the digits of a number, once with a loop and once with recursion. "
            "Add a docstring to each and test both with at least three assert statements. Thank you."
        ),
        "notes_extra": {
            "key_points": [
                "Functions avoid repeating code: write the logic once and call it many times.",
                "A function can take several parameters, use keyword arguments and return multiple values.",
                "Recursive calls are stored on the call stack; too deep a recursion raises a recursion error.",
                "Naive recursive Fibonacci repeats work; memoisation stores results to speed it up.",
            ],
            "concepts": [
                {"term": "Docstring", "definition": "A triple-quoted text on the first line of a function that explains what it does."},
                {"term": "Call stack", "definition": "The structure Python uses to keep track of function calls that are waiting for results."},
                {"term": "Memoisation", "definition": "Storing results of earlier calls so they are not calculated again."},
                {"term": "assert", "definition": "A statement that stops the program with an error if a condition is false, used for simple tests."},
            ],
            "sections": [
                {
                    "heading": "Writing good functions",
                    "points": [
                        "A good function does one thing and has a verb-based name.",
                        "Keyword arguments, such as width=6, make calls easier to read.",
                        "Multiple return values come back as a tuple that can be unpacked.",
                    ],
                },
                {
                    "heading": "Tracing recursion",
                    "points": [
                        "sum_to_n(3) = 3 + sum_to_n(2) = 3 + 2 + sum_to_n(1) = 3 + 2 + 1 + sum_to_n(0).",
                        "The answers return back up the stack: 0, 1, 3, 6.",
                        "Python's default recursion limit is about 1000 calls.",
                    ],
                },
                {
                    "heading": "Choosing recursion or loops",
                    "points": [
                        "Use recursion for tree-shaped or self-similar problems such as folders and Tower of Hanoi.",
                        "Use loops for simple counting and summing.",
                        "Test small functions one at a time with assert.",
                    ],
                },
            ],
            "practice_questions": [
                {"question": "Why does changing a global variable inside a function without the global keyword cause an error?", "answer": "The assignment makes the name local, so Python tries to read it before it has a value."},
                {"question": "Why is the simple recursive Fibonacci function slow for large n?", "answer": "It recalculates the same values many times, so the number of calls roughly doubles with each increase in n."},
            ],
        },
    },
}
