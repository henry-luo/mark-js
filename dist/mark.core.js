(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Mark=f()}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){let MarkMutate=function(Mark,lenSymbol){let $length=lenSymbol;let api={push:function(){let length=this[$length];for(let i=0;i<arguments.length;i++){Object.defineProperty(this,length+i,{value:arguments[i],writable:true,configurable:true})}length+=arguments.length;this[$length]=length;return length},pop:function(){let length=this[$length];if(length>0){let item=this[length-1];delete this[length-1];this[$length]=length-1;return item}else{return undefined}},insert:function(item,index){index=index||0;let length=this[$length];if(index<0||index>length){throw"Invalid index"}let offset=item instanceof Array?item.length:1;for(let i=length-1;i>=index;i--){Object.defineProperty(this,i+offset,{value:this[i],writable:true,configurable:true})}if(offset>1){for(let i=0;i<offset;i++){Object.defineProperty(this,index+i,{value:item[i],writable:true,configurable:true})}}else{Object.defineProperty(this,index,{value:item,writable:true,configurable:true})}this[$length]=length+offset;return this},remove:function(index){if(arguments.length){var length=this[$length];if(index>=0&&index<length){for(var i=index;i<length-1;i++){this[i]=this[i+1]}this[$length]=length-1}}return this},set:function(key,value){var index;if(typeof key==="string"){if(isNaN(key*1)){this[key]=value;return this}index=key*1}else if(typeof key==="number"){index=key}else{return this}if(Math.round(index)===index){if(0<=index&&index<this[$length]){this[index]=value}else if(index===this[$length]){this[index]=value;this[$length]}}return this},replaceWith:function(obj){let trg=this;for(let p in trg){if(typeof trg[p]!=="function")delete trg[p]}for(let i=0,len=trg[$length];i<len;i++){delete trg[i]}Object.setPrototypeOf(trg,Object.getPrototypeOf(obj));for(let p in obj){trg[p]=obj[p]}var length=obj[$length];for(let i=0;i<length;i++){Object.defineProperty(trg,i,{value:obj[i],writable:true,configurable:true})}trg[$length]=length;return this}};for(let a in api){Object.defineProperty(Mark.prototype,a,{value:api[a],writable:true,configurable:true})}};module.exports=MarkMutate},{}],2:[function(require,module,exports){const $length=Symbol("Mark.length");const $parent=Symbol("Mark.parent");const $pragma=Symbol("Mark.pragma");let $convert=null;var MARK=function(){"use strict";let constructors={};if(!constructors.constructor.name){obj.constructor.name="Object"}function Mark(typeName,props,contents){"use strict";var con=constructors[typeName];if(!con){if(typeof typeName!=="string"){throw"Type name should be a string"}con=constructors[typeName]=function(){};Object.defineProperty(con,"name",{value:typeName,configurable:true});Object.setPrototypeOf(con.prototype,Mark.prototype)}var obj=Object.create(con.prototype);if(props){for(let p in props){if(isNaN(p*1)){obj[p]=props[p]}}}let len=0;if(contents){let prevType=null;function addContents(items){for(let val of items){let t=typeof val;if(t==="string"){if(!val.length)continue;if(prevType==="string"){len--;val=obj[len]+val}}else if(t==="object"){if(val===null)continue;else if(val instanceof Array){addContents(val);continue}val[$parent]=obj}else if(t==="undefined"){continue}else{val=val.toString();if(prevType==="string"){len--;val=obj[len]+val}}Object.defineProperty(obj,len,{value:val,writable:true,configurable:true});prevType=t;len++}}addContents(contents)}obj[$length]=len;return obj}var api={contents:function(){let list=[];for(let c of this){list.push(c)}return list},length:function(){return this[$length]},parent:function(pa){return this[$parent]},pragma:function(value){return this[$pragma]},filter:function(func,thisArg){if(!(typeof func==="function"&&this))throw new TypeError;const obj=Object(this);let res=[],i=0;for(const n of obj){if(func.call(thisArg||obj,n,i,obj)){res.push(n)}i++}return res},map:function(func,thisArg){if(!(typeof func==="function"&&this))throw new TypeError;const obj=Object(this);let res=[],i=0;for(const n of obj){res[i]=func.call(thisArg||obj,n,i,obj);i++}return res},reduce:function(func){if(!(typeof func==="function"&&this))throw new TypeError;let obj=Object(this),len=obj[$length],k=0,value;if(arguments.length==2){value=arguments[1]}else{if(k>=len){throw new TypeError("Reduce of empty contents with no initial value")}value=obj[k++]}for(;k<len;k++){value=func(value,obj[k],k,obj)}return value},every:function(func,thisArg){if(!(typeof func==="function"&&this))throw new TypeError;let i=0,obj=Object(this);for(const n of obj){var result=func.call(thisArg||obj,n,i,obj);if(!result){return false}i++}return true},some:function(func,thisArg){if(!(typeof func==="function"&&this))throw new TypeError;let i=0,obj=Object(this);for(const n of obj){if(func.call(thisArg||obj,n,i,obj)){return true}i++}return false},source:function(options){return MARK.stringify(this,options)},html:function(options){let opt=options||{};opt.format="html";return MARK.stringify(this,opt)},xml:function(options){let opt=options||{};opt.format="xml";return MARK.stringify(this,opt)}};for(let a in api){Object.defineProperty(Mark.prototype,a,{value:api[a],writable:true,configurable:true})}try{require("./lib/mark.selector.js")(Mark)}catch(e){console.trace("No Mark Selector API",e.message)}try{require("./lib/mark.mutate.js")(Mark,$length)}catch(e){console.trace("No Mark Mutate API",e.message)}Mark.prototype[Symbol.iterator]=function*(){let length=this[$length];for(let i=0;i<length;i++){yield this[i]}};Mark.pragma=function(pragma,parent){let con=constructors["!pragma"];if(!con){con=Object.create(null);Object.defineProperty(con,"pragma",{value:api.pragma});Object.defineProperty(con,"parent",{value:api.parent});Object.defineProperty(con,"valueOf",{value:Object.valueOf});Object.defineProperty(con,"toString",{value:function(){return"[object Pragma]"}});constructors["!pragma"]=con}let obj=Object.create(con);obj[$pragma]=pragma;if(parent){obj[$parent]=parent}return obj};function isNameChar(c){return"a"<=c&&c<="z"||"A"<=c&&c<="Z"||"0"<=c&&c<="9"||c==="_"||c==="$"||c==="."||c==="-"}function isNameStart(c){return"a"<=c&&c<="z"||"A"<=c&&c<="Z"||c==="_"||c==="$"}Mark.isName=function(key){if(typeof key!=="string"){return false}if(!isNameStart(key[0])){return false}var i=1,length=key.length;while(i<length){if(!isNameChar(key[i])){return false}i++}return true};return Mark}();MARK.parse=function(){"use strict";let UNEXPECT_END="Unexpected end of input";let at,lineNumber,columnNumber,ch,text,escapee={"'":"'",'"':'"',"\\":"\\","/":"/","\n":"",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},ws=[" ","\t","\r","\n","\v","\f"," ","\ufeff"],renderChar=function(chr){return chr===""?"EOF":"'"+chr+"'"},error=function(m){var msg=m+" at line "+lineNumber+" column "+columnNumber+" of the Mark data. Still to read: "+JSON.stringify(text.substring(at-1,at+30)+"...");var error=new SyntaxError(msg);error.at=at;error.lineNumber=lineNumber;error.columnNumber=columnNumber;throw error},next=function(c){if(c&&c!==ch){error("Expected "+renderChar(c)+" instead of "+renderChar(ch))}ch=text.charAt(at);at++;columnNumber++;if(ch==="\n"||ch==="\r"&&peek()!=="\n"){lineNumber++;columnNumber=0}return ch},peek=function(){return text.charAt(at)},identifier=function(){var key=ch;if(ch!=="_"&&ch!=="$"&&(ch<"a"||ch>"z")&&(ch<"A"||ch>"Z")){error("Bad identifier as unquoted key")}while(next()&&("a"<=ch&&ch<="z"||"A"<=ch&&ch<="Z"||"0"<=ch&&ch<="9"||ch==="_"||ch==="$"||ch==="."||ch==="-")){key+=ch}return key},number=function(){let number,sign="",string="",base=10;if(ch==="-"||ch==="+"){sign=ch;next(ch)}if(ch==="I"){number=word();if(typeof number!=="number"||isNaN(number)){error("Unexpected word for number")}return sign==="-"?-number:number}if(ch==="N"){number=word();if(!isNaN(number)){error("expected word to be NaN")}return number}if(ch==="0"){string+=ch;next()}else{while(ch>="0"&&ch<="9"){string+=ch;next()}if(ch==="."){string+=".";while(next()&&ch>="0"&&ch<="9"){string+=ch}}if(ch==="e"||ch==="E"){string+=ch;next();if(ch==="-"||ch==="+"){string+=ch;next()}while(ch>="0"&&ch<="9"){string+=ch;next()}}}if(sign==="-"){number=-string}else{number=+string}if(!isFinite(number)){error("Bad number")}else{return number}},string=function(){var hex,i,string="",triple=false,delim,uffff;if(ch==='"'||ch==="'"){delim=ch;if(peek()===delim&&text.charAt(at+1)===delim){triple=true;next();next()}while(next()){if(ch===delim){next();if(!triple){return string}else if(ch===delim&&peek()===delim){next();next();return string}else{string+=delim}}if(ch==="\\"){if(triple){string+="\\"}else{next();if(ch==="u"){uffff=0;for(i=0;i<4;i+=1){hex=parseInt(next(),16);if(!isFinite(hex)){break}uffff=uffff*16+hex}string+=String.fromCharCode(uffff)}else if(ch==="\r"){if(peek()==="\n"){next()}}else if(typeof escapee[ch]==="string"){string+=escapee[ch]}else{break}}}else{string+=ch}}}error("Bad string")},inlineComment=function(){if(ch!=="/"){error("Not an inline comment")}do{next();if(ch==="\n"||ch==="\r"){next();return}}while(ch)},blockComment=function(){if(ch!=="*"){error("Not a block comment")}do{next();while(ch==="*"){next("*");if(ch==="/"){next("/");return}}}while(ch);error("Unterminated block comment")},comment=function(){if(ch!=="/"){error("Not a comment")}next("/");if(ch==="/"){inlineComment()}else if(ch==="*"){blockComment()}else{error("Unrecognized comment")}},white=function(){while(ch){if(ch==="/"){comment()}else if(ws.indexOf(ch)>=0){next()}else{return}}},word=function(){switch(ch){case"t":next("t");next("r");next("u");next("e");return true;case"f":next("f");next("a");next("l");next("s");next("e");return false;case"n":next("n");next("u");next("l");next("l");return null;case"I":next("I");next("n");next("f");next("i");next("n");next("i");next("t");next("y");return Infinity;case"N":next("N");next("a");next("N");return NaN}error("Unexpected character "+renderChar(ch))},value,array=function(){var array=[];next();white();while(ch){if(ch==="]"){next();return array}if(ch===","){error("Missing array element")}else{array.push(value())}white();if(ch===","){next();white()}}},object=function(parent){let obj={},key=null,extended=false,hasBrace=false,index=0;if(parent){obj[$parent]=parent}next();let bkAt=at,bkLineNumber=lineNumber,bkColumnNumber=columnNumber;let putText=function(text){if(index>0&&typeof obj[index-1]==="string"){obj[index-1]+=text}else{Object.defineProperty(obj,index,{value:text,writable:true,configurable:true});index++}},parseContent=function(){while(ch){if(ch==="{"){hasBrace=true;Object.defineProperty(obj,index,{value:object(obj),writable:true,configurable:true});index++}else if(ch==='"'||ch==="'"){let str=string();if(str)putText(str)}else if(ch==="}"){next();obj[$length]=index;return}else{error("Unexpected character "+renderChar(ch))}white()}error(UNEXPECT_END)},parsePragma=function(){if(hasBrace||key){error("Bad object")}at=bkAt;lineNumber=bkLineNumber;columnNumber=bkColumnNumber;ch=text.charAt(at-1);let pragma="";while(ch){if(ch==="}"){next();return MARK.pragma(pragma,parent)}else if(ch==="\\"){next();if(ch!=="{"&&ch!=="}"&&ch!==":"&&ch!==";"){pragma+="\\"}}else if(ch==="{"||ch==="}"||ch===":"){error("Bad object")}else if(ch===";"){error("Character ';' should be escaped in Mark pragma")}pragma+=ch;next()}error(UNEXPECT_END)};white();while(ch){if(ch==="}"){next();if(extended){obj[$length]=index}return obj}if(ch==="{"){if(extended){hasBrace=true;parseContent();return obj}error("Unexpected character '{'")}if(ch==='"'||ch==="'"){var str=string();white();if(ch===":"){key=str}else{if(extended){if(str)putText(str);if(ch==="}"||ch==="{"||ch==='"'||ch==="'"){parseContent();return obj}else{return parsePragma()}}else if(!key){obj=MARK(str,null,null,parent);extended=true;continue}else{return parsePragma()}}}else if(ch==="_"||ch==="$"||"a"<=ch&&ch<="z"||"A"<=ch&&ch<="Z"){var ident=identifier();white();if(ch==":"){key=ident}else{if(!extended){obj=MARK(ident,null,null,parent);extended=true;continue}return parsePragma()}}else{return parsePragma()}next();if(ch==="{"){hasBrace=true}var val=value();if(extended&&!isNaN(key*1)){error("Numeric key not allowed as Mark property name")}if(obj[key]&&typeof obj[key]!=="function"){error("Duplicate key not allowed: "+key)}obj[key]=val;white();if(ch===","){next();white()}}error(UNEXPECT_END)};value=function(){white();switch(ch){case"{":return object();case"[":return array();case'"':case"'":return string();case"-":case"+":case".":return number();default:return ch>="0"&&ch<="9"?number():word()}};return function(source,options){at=0;lineNumber=1;columnNumber=1;ch=" ";text=String(source);if(!source){text="";error(UNEXPECT_END)}if(typeof options==="object"&&options.format&&options.format!="mark"){if(!$convert){$convert=require("./lib/mark.convert.js")(MARK)}return $convert.parse(source,options)}var result=value();white();if(ch){error("Syntax error")}return result}}();MARK.stringify=function(obj,options){"use strict";var indentStep,indentStrs,space,omitComma;function indent(num,noNewLine){if(num>=indentStrs.length){for(var i=indentStrs.length;i<=num;i++){indentStrs[i]=indentStrs[i-1]+indentStep}}return noNewLine?indentStrs[num]:"\n"+indentStrs[num]}if(options){omitComma=options.omitComma;space=options.space;indentStrs=[""];if(space){if(typeof space==="string"){indentStep=space}else if(typeof space==="number"&&space>=0){indentStep=new Array(space+1).join(" ")}else{indentStep=""}if(indentStep&&indentStep.length>10){indentStep=indentStep.substring(0,10)}}if(options.format&&options.format!=="mark"){if(!$convert){$convert=require("./lib/mark.convert.js")(MARK)}$convert.indent=indent;if(options.format==="xml")return $convert.toXml(obj,options);if(options.format==="html")return $convert.toHtml(obj,options)}}function isArray(obj){return Array.isArray?Array.isArray(obj):Object.prototype.toString.call(obj)==="[object Array]"}function isDate(obj){return Object.prototype.toString.call(obj)==="[object Date]"}var objStack=[];function checkForCircular(obj){for(var i=0;i<objStack.length;i++){if(objStack[i]===obj){throw new TypeError("Converting circular structure to JSON")}}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};function escapeString(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function internalStringify(obj_part){var buffer,res;if(obj_part&&!isDate(obj_part)){obj_part=obj_part.valueOf()}switch(typeof obj_part){case"boolean":return obj_part.toString();case"number":if(isNaN(obj_part)||!isFinite(obj_part)){return"null"}return obj_part.toString();case"string":return escapeString(obj_part.toString());case"object":if(obj_part===null){return"null"}else if(isArray(obj_part)){checkForCircular(obj_part);buffer="[";objStack.push(obj_part);for(var i=0;i<obj_part.length;i++){res=internalStringify(obj_part[i]);if(indentStep)buffer+=indent(objStack.length);if(res===null||typeof res==="undefined"){buffer+="null"}else{buffer+=res}if(i<obj_part.length-1){buffer+=omitComma?" ":","}else if(indentStep){buffer+="\n"}}objStack.pop();if(obj_part.length&&indentStep){buffer+=indent(objStack.length,true)}buffer+="]"}else{checkForCircular(obj_part);buffer="{";var nonEmpty=false;if(!obj_part.constructor){return obj_part[$pragma]?"{"+obj_part[$pragma]+"}":"null"}objStack.push(obj_part);if(obj_part.constructor.name!=="Object"||obj_part instanceof MARK){buffer+=obj_part.constructor.name;nonEmpty=true}var hasAttr=false;for(var prop in obj_part){var value=internalStringify(obj_part[prop]);if(typeof value!=="undefined"){var key=MARK.isName(prop)?prop:escapeString(prop);buffer+=(hasAttr?omitComma?" ":", ":nonEmpty?" ":"")+key+":"+value;hasAttr=true;nonEmpty=true}}var length=obj_part[$length];if(length){for(var i=0;i<length;i++){buffer+=" ";var item=obj_part[i];if(typeof item==="string"){if(indentStep)buffer+=indent(objStack.length);buffer+=escapeString(item.toString())}else if(typeof item==="object"){if(indentStep)buffer+=indent(objStack.length);buffer+=internalStringify(item)}else{console.log("unknown object",item)}}}objStack.pop();if(nonEmpty){if(length&&indentStep){buffer+=indent(objStack.length)}buffer+="}"}else{buffer="{}"}}return buffer;default:return undefined}}if(obj===undefined){return undefined}return internalStringify(obj)};if(typeof module==="object")module.exports=MARK},{"./lib/mark.convert.js":"/lib\\mark.convert.js","./lib/mark.mutate.js":1,"./lib/mark.selector.js":"/lib\\mark.selector.js"}]},{},[2])(2)});
