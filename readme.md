
Test
====================================================
Build script borrowed from the [fullcalendar repo](http://arshaw.com/fullcalendar/).


Getting Set Up
--------------

You will need [Git](http://git-scm.com/), [Node](http://nodejs.org/), and NPM installed.
For clarification, please view the
[jQuery readme](https://github.com/jquery/jquery/blob/master/README.md#what-you-need-to-build-your-own-jquery),
which requires a similar setup.

Also, you will need to have the [Grunt](http://gruntjs.com/) build system installed globally (`-g`) on your system:

	npm install -g grunt-cli

Then, clone FullCalendar's git repo:

	git clone git://github.com/arshaw/stockticker.git

Enter the directory and install FullCalendar's development dependencies:

	cd stockticker && npm install


Development Workflow
--------------------

After you make code changes, you'll want to compile the JS/CSS so that it can be previewed from the tests and demos.
You can either manually rebuild each time you make a change:

	grunt
