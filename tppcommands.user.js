// ==UserScript==
// @name        Twitch Plays Pokemon Commands
// @namespace   github.com/graulund/tppcommands
// @description Helping you press what you want on the touch screen by converting commands into coordinates.

// @include     /^https?://(www|beta)\.twitch\.tv\/(twitchplayspokemon(/(chat.*)?)?|chat\/.*channel=twitchplayspokemon.*)$/

// @version     1.0
// @updateURL   http://github.com/graulund/tppcommands/raw/master/tppcommands.user.js
// @grant       unsafeWindow
// ==/UserScript==

/*
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 
 // BIG shoutouts to the original TPP chat filter script. Good pointers.
 
 (function(){
"use strict";

var myWindow;
try {
    myWindow = unsafeWindow;
} catch(e) {
    myWindow = window;
}

var $ = myWindow.jQuery, console = myWindow.console;

console.log("TPP Commands launched");

// Configuration (all keys should be lowercase)

var touchCommands = {
	"att1":  "126,54",
	"att2":  "200,54",
	"att3":  "126,102",
	"att4":  "200,102",
	"poke1": "100,1",
	"poke2": "200,10",
	"poke3": "100,85",
	"poke4": "200,85",
	"poke5": "100,103",
	"poke6": "200,145",
	"run":   "126,191"
};

// Do it!

var getStringMatch = function(str, regex){
	var m = str.match(regex)
	if(m instanceof Array && m.length > 0){
		return m[0]
	}
	return ""
}

$(function(){
	var Room_proto = myWindow.App.Room.prototype;
	var original_send = Room_proto.send;
	Room_proto.send = function(message){
		
		//var command = message.toLowerCase().replace(/^\s+|\s+$/, "");
		var commandRegex = /^\s*([a-z0-9]+)\b/, m = message.toLowerCase().match(commandRegex);

		if(m instanceof Array){
			var command = m[0];

			if(command in touchCommands){
				// Transform!
				arguments[0] = message = message.replace(commandRegex, touchCommands[command]);

				// Log
				console.log("TPP Commands: Sent command \"" + touchCommands[command] + "\" (\"" + command + "\")");
			}
		}

		return original_send.apply(this, arguments);
	};
});

}());