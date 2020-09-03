var args = arguments[0] || {};
$.label.text = args.title || '';
$.label.color="#FFF";
var fontSize = args.fontSize;
if(!fontSize){
    fontSize = 20;
}
$.label.font = {
    fontSize : fontSize
};
if(OS_IOS)
    $.view.height = 35;
else
    $.view.height = 40;