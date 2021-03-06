//Caret.JS
/* jshint browser: true */

(function () {

// We'll copy the properties below into the mirror div.
// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
var properties = [
  'direction',  // RTL support
  'boxSizing',
  'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY',  // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',  // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize'

];

var isBrowser = (typeof window !== 'undefined');
var isFirefox = (isBrowser && window.mozInnerScreenX != null);

function getCaretCoordinates(element, position, options) {
  if (!isBrowser) {
    throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
  }

  var debug = options && options.debug || false;
  debug = false;
  if (debug) {
    var el = document.querySelector('#input-textarea-caret-position-mirror-div');
    if (el) el.parentNode.removeChild(el);
  }

  // The mirror div will replicate the textarea's style
  var div = document.createElement('div');
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  var style = div.style;
  var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9
  var isInput = element.nodeName === 'INPUT';

  // Default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (!isInput)
    style.wordWrap = 'break-word';  // only for textarea-s

  // Position off-screen
  style.position = 'absolute';  // required to return coordinates properly
  if (!debug)
    style.visibility = 'hidden';  // not 'display: none' because we want rendering

  // Transfer the element's properties to the div
  properties.forEach(function (prop) {
    if (isInput && prop === 'lineHeight') {
      // Special case for <input>s because text is rendered centered and line height may be != height
      if (computed.boxSizing === "border-box") {
        var height = parseInt(computed.height);
        var outerHeight =
          parseInt(computed.paddingTop) +
          parseInt(computed.paddingBottom) +
          parseInt(computed.borderTopWidth) +
          parseInt(computed.borderBottomWidth);
        var targetHeight = outerHeight + parseInt(computed.lineHeight);
        if (height > targetHeight) {
          style.lineHeight = height - outerHeight + "px";
        } else if (height === targetHeight) {
          style.lineHeight = computed.lineHeight;
        } else {
          style.lineHeight = 0;
        }
      } else {
        style.lineHeight = computed.height;
      }
    } else {
      style[prop] = computed[prop];
    }
  });

  if (isFirefox) {
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  div.textContent = element.value.substring(0, position);
  // The second special handling for input type="text" vs textarea:
  // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (isInput)
    div.textContent = div.textContent.replace(/\s/g, '\u00a0');

  var span = document.createElement('span');
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // For inputs, just '.' would be enough, but no need to bother.
  span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
  div.appendChild(span);

  var coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    height: parseInt(computed['lineHeight'])
  };

  if (debug) {
    span.style.backgroundColor = '#aaa';
  } else {
    document.body.removeChild(div);
  }

  return coordinates;
}

if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
  module.exports = getCaretCoordinates;
} else if(isBrowser) {
  window.getCaretCoordinates = getCaretCoordinates;
}

}());


//End of Caret.JS































//Get Base URL
//Example : if URL is http://localhost/r/Main/Internet 
//          then, base URL is http://localhost/r/Main/
function getBaseURL() {
	var thisPageURL = window.location.href;
	if (thisPageURL === "http://localhost/r/") 
	{ 
		thisPageURL = thisPageURL + "Main/"
	}
	else {
		var enough = false;
		while (!enough) {
			var length = thisPageURL.length;
			var lastChar = thisPageURL.charAt(length-1);
			
			if (lastChar === "/") {
				enough = true
			}
			else {
				thisPageURL = thisPageURL.slice(0,-1)
			}
		}
	}
	return thisPageURL;
}

function getStat(){
	var a = document.getElementById("text");
	console.log("clientHeight" + a.clientHeight);
	console.log("cols" + a.cols);
	console.log("rows" + a.rows);
	console.log("scrollHeight" + a.scrollHeight);
	console.log("selectionEnd" + a.selectionEnd);

}


//Convert string to title case
//Example: if input is ababa
//         then, output is Ababa
function titleCaser(item) {
	var theFirst = item.charAt(0);
	theFirst = theFirst.toUpperCase();
	var theRest = item.slice(1);
	var combined = theFirst + theRest;
	return combined
}

//Copy "str" string to clipboard
function copyToClipboard(str){
	var el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly','');
	el.style = {display:'none'};
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

//DragDrop to Upload
var dropArea = document.querySelector("#dropzone");
var everything = document.querySelector("body");
dropArea.addEventListener("dragenter",preventDefaults,false);
dropArea.addEventListener("dragover",preventDefaults,false);
dropArea.addEventListener("dragleave",preventDefaults,false);
dropArea.addEventListener("drop",preventDefaults,false);
dropArea.addEventListener("dragenter",highlight,false);
dropArea.addEventListener("dragover",highlight,false);
dropArea.addEventListener("dragleave",unhighlight,false);
dropArea.addEventListener("drop",unhighlight,false);
everything.addEventListener("dragenter",highlight,false);
everything.addEventListener("dragover",highlight,false);
everything.addEventListener("dragleave",unhighlight,false);
everything.addEventListener("drop",unhighlight,false);
dropArea.addEventListener("drop",handleDrop,false);

function preventDefaults(e){
	e.preventDefault()
	e.stopPropagation()
}
function highlight(e){
	console.log("dragenter!")
	dropArea.classList.add('highlight')
}
function unhighlight(e){
	dropArea.classList.remove('highlight')
}
function handleDrop(e){
	var dt = e.dataTransfer
	var files = dt.files
	console.log(files)
	handleFiles(files)
}
function handleFiles(files){
	([...files].forEach(uploadFile))
}
function uploadFile(file){
	console.log(file)
	var url = window.location.href +"?action=postupload";
	var fullURL = window.location.href;
  fullURL = fullURL.split("/")
  var n = fullURL[fullURL.length-2]+"."+fullURL[fullURL.length-1]
	console.log(url);
	var formData = new FormData()
	formData.append('n',n)
	formData.append('action',"postupload")
	formData.append('uploadfile',file)
	fetch(url,{
		method:'POST',
		body:formData
	})
	.then((e)=>{
		console.log("Sudah dapat jawaban!")
		console.log(e)
		var responseURL = e.url
		if (responseURL.includes("upresult=success")){
			window.location = window.location.href

		}

	})
	.catch(()=>{console.log("error")})
}


var masterTitle = document.title;
var nodeSourceCode = "";

//Asynchronous Save Changes
//Called once every 3 minutes
function saveChanges(){
	//console.log("Past Node Source Code :" + nodeSourceCode);
	var n = document.querySelector("form[name='nodeeditor'] input[name='n']").value
	var basetime = document.querySelector("form[name='nodeeditor'] input[name='basetime']").value
	var textContent = document.querySelector("#text").value
	if (textContent == nodeSourceCode) {
		//console.log("No changes, abort autosave..");
		return 0;
	}

	var postbody2 = new URLSearchParams()
	postbody2.append("action","edit")
	postbody2.append("n",n)
	postbody2.append("basetime",basetime)
	postbody2.append("text",textContent)
	postbody2.append("csum","")
	postbody2.append("author","")
	postbody2.append("postedit"," Save and edit ")
	var url = window.location.href;
	fetch(url,{
		method:'POST',
		headers : new Headers({
			'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Content-Type':'application/x-www-form-urlencoded'}),
		body:postbody2
	})
	.then((e)=>{
			var oldTitle = document.title;
			document.title = "Saved...";
			setTimeout(function(){
				var d = new Date()
				var h = d.getHours()
				var m = d.getMinutes()
				oldTitle = "["+h+":"+m + "] " + masterTitle
				document.title = oldTitle

			}, 1000);
			e.text().then(function(r){
				//console.log(r)
				var retrievedHTML = r 
				var newDateRegex = /name='basetime' value='(.*)'/g;
				var match = newDateRegex.exec(r)
				var timeCode = match[1]
				document.querySelector("form[name='nodeeditor'] input[name='basetime']").value = timeCode
				nodeSourceCode = textContent;
			})		
	})
	.catch((e)=>{
		console.log("error")
		console.log(e)
		})
}


//Synchronous Save Changes
//Called once, just a moment before exiting the application.
function syncSaveChanges(){
	document.title = "Saving..";
	var n = document.querySelector("form[name='nodeeditor'] input[name='n']").value
	var basetime = document.querySelector("form[name='nodeeditor'] input[name='basetime']").value
	var textContent = document.querySelector("#text").value
	var postbody2 = new URLSearchParams()
	postbody2.append("action","edit")
	postbody2.append("n",n)
	postbody2.append("basetime",basetime)
	postbody2.append("text",textContent)
	postbody2.append("csum","")
	postbody2.append("author","")
	postbody2.append("postedit"," Save and edit ")
	var url = window.location.href;
	var xhr = new XMLHttpRequest();
	xhr.open('POST',url,false)
	xhr.setRequestHeader = ("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
	xhr.setRequestHeader = ("Content-Type","application/x-www-form-urlencoded")
	xhr.send(postbody2)
	document.title = "Saved!";
}


//Core Save Functionality
//If currently on Edit Mode, enable autosave each 3 minutes and always saving before unload
var thisPageURL = window.location.href;
if (thisPageURL.includes("?action=edit")) {
	nodeSourceCode = document.querySelector("#text").value;
	var intervalID = setInterval(saveChanges,180000)
	window.onbeforeunload = function(){
		syncSaveChanges();
		//saveChanges();
		return null;
	}	
}



function cursorScroll(x){
	var text = document.getElementById("text");
	var cursorPos = text.selectionStart;
	var textVal = text.value;
	var counter = 0;

	//Code 1 means go down 5 lines
	if(x == 1) {
		for (var i=cursorPos ; i <textVal.length ;i++) {
			if(textVal.charAt(i) == '\n'){
				counter = counter + 1;
			}
			if(counter == 6) {
				break;
			}
		}
		if(i != textVal.length) {
			i = i +1;
		}
	}
	//Code 2 means go up 5 lines
	else if (x == 2) {
		for (var i=cursorPos ; i > 0 ;i--) {
			if(textVal.charAt(i) == '\n'){
				counter = counter + 1;
			}
			if(counter == 6) {
				break;
			}
		}
		if(i != 0) {
			i = i -1;
		} 
	}


	text.selectionStart = i;
  text.selectionEnd = i;
 
}


var currentURL = window.location.href;


document.onkeydown = function(e){

	
	if ((e.which == 34) && (currentURL.includes("?action=edit"))) {
  		e.preventDefault();
  		cursorScroll(1);
  	}
  	else if ((e.which == 33) && (currentURL.includes("?action=edit"))) {
  		e.preventDefault();
  		cursorScroll(2);
  	}

} 










//Shortcut Functionality
document.onkeyup = function(e) {
  
  //Ctrl+. : Create New Node
  if (e.ctrlKey && e.which == 190) {
  	var baseURL = getBaseURL()
  	var splitBaseURL = baseURL.split("/")
  	var filtered = splitBaseURL.filter(function(el){
  		return el != ""
  	})
  	
  	if (filtered.length == 3){
  		baseURL += "Main/"
  	}

		var a = prompt("Enter new note key to create");
		if (a != null){
			var split_a = a.split(" ");
			console.log(split_a);
			var i = 0;
			for (var i=0; i <split_a.length; i++){
				split_a[i] = titleCaser(split_a[i])
			}
			a = ""
			for (var i=0; i <split_a.length; i++){
				a = a + split_a[i]
			}
			var URL = baseURL + a + "?action=edit";
			console.log(URL);
			window.location = URL;
			//window.location = baseURL + a + "?action=edit";
		}
  }

  else if (e.ctrlKey && e.which == 191){
  	var baseURL = getBaseURL()
  	var splitBaseURL = baseURL.split("/")
  	var filtered = splitBaseURL.filter(function(el){
  		return el != ""
  	})
  	
  	if (filtered.length == 3){
  		baseURL += "Main/"
  	}

		var a = prompt("Enter note key to visit");
		if (a != null){
			var split_a = a.split(" ");
			console.log(split_a);
			var i = 0;
			for (var i=0; i <split_a.length; i++){
				split_a[i] = titleCaser(split_a[i])
			}
			a = ""
			for (var i=0; i <split_a.length; i++){
				a = a + split_a[i]
			}
			var URL = baseURL + a;
			console.log(URL);
			window.location = URL;
			//window.location = baseURL + a + "?action=edit";
		}

  }

  //Ctrl+, : Edit Current Node
  else if (e.ctrlKey && e.which == 188) {
	window.location = window.location.href+"?action=edit";
  }

  //Ctrl+[ : Show current page history
  else if (e.ctrlKey && e.which == 219) {
	window.location = window.location.href+"?action=diff";
  }

  //Ctrl+] : Show all page history
  else if (e.ctrlKey && e.which == 221) {
	window.location = "http://localhost/r3/pub/nodemanager/";
  }


  //Ctrl+; : Copy Current Node
  else if (e.ctrlKey && e.which == 59){
  	var fullURL = window.location.href;
  	fullURL = fullURL.split("/")
  	var nodeKey = fullURL[fullURL.length-1];
  	var titleNode = document.querySelector(".pagetitle");
  	var linkSyntax = "[[" + nodeKey +"|" + titleNode.innerHTML  +"]]";
  	copyToClipboard(linkSyntax);
  	var oldTitle = document.title;
  	document.title = "Node Copied..";
  	setTimeout(function(){
  		document.title = oldTitle;
  	}, 1000);
  }

  //Ctrl+' : Save Node (Deprecated)
  else if (e.ctrlKey && e.which == 222){
  	saveChanges()
  }
  


};

//"Class" Functionality
//Fixing proper link from instance to class
var targetnode = document.getElementById("rtnf");
target = targetnode.href
target = target.replace("%3C/p%3E","")
target = target.replace("%3Cp%3E","")
target = target.replace(new RegExp("%20","g"),"");
target = target.slice(0,-16)
console.log(target);
targetnode.href = target

if(targetnode.innerHTML){
	console.log(targetnode.innerHTML)
	targetnode.innerHTML = targetnode.innerHTML.slice(0,-5)	
	console.log(targetnode.innerHTML)
}






//Autogrowing Node Editor Textarea
var textarea = window.document.querySelector("textarea");
if(textarea){	
	textarea.onkeyup = function(e){

		var caretCoord = getCaretCoordinates(textarea, textarea.selectionEnd, { debug: true });
		//console.log('Caret top = %s', caretCoord.top);
		//console.log('Window Scroll Height = %s', window.scrollY)
		var ergoNumber = caretCoord.top - window.scrollY;
		//console.log('Ergo Number = %s', ergoNumber);

		if (ergoNumber >= 300) {
			//console.log("Bad ergonomy! %s",ergoNumber);
			window.scrollBy(0,100);	
		}
		




		if (textarea.clientHeight < textarea.scrollHeight){
			textarea.style.height = textarea.scrollHeight +"px";
		}
		if(textarea.scrollTop != 0){
			textarea.style.height = textarea.scrollHeight + "px";
			window.scrollBy(0,205);
			console.log("Did something! " + textarea.scrollTop)
		}
	
		if(e.which == 34){
			
			window.scrollBy(0,125);	
		}
		else if (e.which == 33){
			
			window.scrollBy(0,-125);
		}
	}
}

window.addEventListener("load",function() {
	textarea = window.document.querySelector("textarea");
	if(textarea){
	textarea.style.height = textarea.scrollHeight + "px";
	}




},false);






//Img Server Functionality
var target1 = document.getElementById("imgstrg").innerHTML
target1 = target1.replace("</p>","")
target1 = target1.replace("<p>","")
target1 = target1.replace(/(\r\n|\n|\r)/gm, "");
console.log(target1)

function isNumeric(num){
	return !isNaN(num)
}


if (target1.length != 0) {
	console.log("lolos!")
	imgpath = "http://localhost/r/pub/imgstrg/imgstrg_server.php?id=" + target1;
	$.get(imgpath, function(data,status){
		//console.log(data)
		$('<div class="img_showcase"><img style="width:100%" src="' + data +'" ></div>').insertAfter("#wikitext")
	});
}







//Img Paste Functionality
$(function(){
      $('.demo-noninputable').pastableNonInputable();
      $('.demo-textarea').on('focus', function(){
        var isFocused = $(this).hasClass('pastable-focus');
        //console && console.log('[textarea] focus event fired! ' + (isFocused ? 'fake onfocus' : 'real onfocus'));
      }).pastableTextarea().on('blur', function(){
        var isFocused = $(this).hasClass('pastable-focus');
        //console && console.log('[textarea] blur event fired! ' + (isFocused ? 'fake onblur' : 'real onblur'));
      });
      $('.demo-contenteditable').pastableContenteditable();
      $('.demo').on('pasteImage', function(ev, data){
		//Data is the image
		console.log(data)
		
		//Send the image to imgstrg 
		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function(data) {
			if (this.readyState == 4 && this.status == 200) {
				console.log("Image is sent to imgstrg" + data)
				img_id = data.currentTarget.response
				img_script = "(:Imgstrg:"+img_id+":)"
				current_tbox_val = $("#text").val();
				new_tbox_val = current_tbox_val + img_script;
				$("#text").val(new_tbox_val);
			}
		}
		xhttp.open("POST","http://localhost/r3/pub/imgstrg/imgstrg.php")
		var formData = new FormData();
		formData.append('size',data.blob.size);
		formData.append('type',data.blob.type);
		formData.append('dataURL',data.dataURL);
		formData.append('height',data.height);
		formData.append('width',data.width);
		xhttp.send(formData)
		
		
		
        var blobUrl = URL.createObjectURL(data.blob);
        $('<div class="img_showcase"><img style="width:100%" src="' + data.dataURL +'" ></div>').insertAfter(this);
      }).on('pasteImageError', function(ev, data){
        alert('Oops: ' + data.message);
        if(data.url){
          alert('But we got its url anyway:' + data.url)
        }
      }).on('pasteText', function(ev, data){
        //$('<div class="result"></div>').text('text: "' + data.text + '"').insertAfter(this);
      });
    });
console.log("Prep done!")


//Nodepeek

function nodepeek(node){
	console.log(node)
}

var wikilinks = document.getElementsByClassName("wikilink")
for (var i=0; i<wikilinks.length; i++){
	wikilinks[i].onmouseover = function() {
		console.log("wikilink selected!");
		var link = this.href
		var link = link.split("/")
		var nodekey = link[link.length-1]
		console.log(nodekey)
		//Send the hovered link to nodeservr 
		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function(data) {
			if (this.readyState == 4 && this.status == 200) {
				console.log(data.currentTarget.response)
				console.log("Hovered link data is sent to nodeservr" + data)
			}
		}
		xhttp.open("POST","http://localhost/r/pub/nodeservr/nodeservr.php")
		var formData = new FormData();
		formData.append('nodekey',nodekey);
		xhttp.send(formData)


	}
}