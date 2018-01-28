function remove(array, element) {
	const index = array.indexOf(element);
	if (index != -1) {
		array.splice(index, 1);
	}
};
lemma = lemma.concat(rare_lemmas);

function sentence_splitter(article){
	return article.replace(/\n/g, " ").replace(/\b(\w{1,}\.\w{1,})\./g, "$1&#x2E;").replace(/(Dr|Esq|Hon|Jr|Mr|Mrs|Ms|Messrs|Mmes|Msgr|Prof|Rev|Rt|Sr|St)\./g, "$1&#x2E;").replace(/\b(\w?)\.(\w)\b/g, "$1&#x2E;$2").match(/(.*?)([\.\?\!])/g);
}

function word_splitter(sentence){
	return sentence.toLowerCase().replace(/[\'\’]/g, " ").replace(/[\n\d+]/g, " ").replace(/[“’—”‘\".,\/#!$\?%\^&\*;:{}=\-_`~()]/g, " ").split(" ").filter(function(elem, index, self) {
		return elem !="";
	});;
}

function lookupWord(sentence, prohibit, lemma) {
	//抓出單字陣列
	var tmp_words = word_splitter(sentence).filter(function(elem, index, self) {
		return index == self.indexOf(elem) && elem.length > 2;
	});
	var words = [];

	tmp_words.forEach(function(word) {
		var this_lemma = lemma.find(function(e) {
			return e.stem === word | e.extra.indexOf(word) != -1
		});
		if (this_lemma) {
			word = this_lemma.stem;
		}
		words.push(word);
	});
	words = words.filter(function(elem, index, self) {
		return index == self.indexOf(elem);
	});

	var excep_words = [];
	for(var i = 1; i <= prohibit; i++){
		var level_index = i;
		var dict_head_string = "";
		var dict_string = "";

		if (level_index < 46) {
			dict_head_string = "boyo400_L";
		}
		else if (45 < level_index && level_index  < 86){
			dict_head_string = "boyo800_L";
			level_index = level_index - 45;
		}
		else if (level_index == 86){
			dict_head_string = "boyo2000";
		}
		dict_string = dict_head_string;
		if(level_index<10){ dict_string = dict_string + "0";}
		if(i != 86) {dict_string = dict_string + level_index;}
		words.forEach(function(e){
			if(boyodict[dict_string].indexOf(e)!=-1){
				excep_words.push(e);
			}
		});
	}
	excep_words.forEach(function(e){remove(words,e);});

	//若沒有任何單字，則不需要單字表格
  if(words.length <= 0){
		return "";
	}

	var html_word = '<div class="table">\n';
	html_word = html_word + '<table>\n';
	html_word += "<tr><th colspan=2>超範圍的單字</th></tr>\n";
	html_word = html_word + "<tr>\n";
	for (var j = 0; j < 2; j++) {
		html_word = html_word + "<th>\n";
		html_word += (j % 2) ? "解釋" : "單字";
		html_word = html_word + "</th>\n";
	}
	html_word = html_word + "</tr>\n";
	var w_index = 0;
	while (w_index != words.length) {
		html_word += "<tr>\n";
		html_word += "<td>\n";
		html_word += words[w_index];
		html_word += "</td>\n";
		html_word += "<td>\n";
		var w_dict = dictionary.find(function(e) {
			return e.word === words[w_index]
		});
		if (w_dict) {
			html_word += w_dict.translation.replace(/\n/, "<br/>");
		} else {
			html_word += "<a target=\"_blank\" href=\"https://www.collinsdictionary.com/dictionary/english-chinese/" + words[w_index] + "\"> 查詢網路字典</a>";
		}
		html_word += "</td>\n";
		html_word += "</tr>\n";
		w_index++;
		if (w_index == words.length) {
			break;
		}
	}
	html_word = html_word + "</table></div>\n";
	return html_word;
};

function split_article_normal(article,level,totalegrade,resultarea){
	var tmp_article = sentence_splitter($("#"+article).val());
	var a_word_count = word_splitter($("#"+article).val()).length;
	var base_grade = $("#"+totalegrade).val() / a_word_count;
	var level = $("#"+level).val();

	var work_result = "";
	var counter = 1;
	var grade = 0;
	var s_word_count = 0;
	tmp_article.forEach(function(e) {
		s_word_count = word_splitter(e).length;
		s_grade = Math.floor(s_word_count * base_grade);
		grade += s_grade;
		work_result += '<div class="jumbotron">';
		work_result += '<div class="row">';
		work_result += '<div class="col-md-8">'
		work_result += "<h3>第" + counter +"句：</h3>";
		work_result += "<h4>" + e +"</h4>";
		work_result += "<h5>(" + s_grade + "分)</h5>\n";
		work_result += '</div>';
		work_result += '<div class="col-md-4">';
		work_result += lookupWord(e, level, lemma);
		work_result += '</div>';
		work_result += '</div>';
		work_result += '<div class="row">';
		work_result += '<div class="col-md-12 border">'
		work_result += '<h5>答：</h5>';
		work_result += '</div>';
		work_result += '</div>';
		work_result += '</div>';
		counter++;
	});
	work_result = '<div class="container-fluid"><h4>總分：' + grade + '分</h4>' + work_result + '</div>';
	$("#"+resultarea).html(work_result);
}

function split_article_indexed(article,level,totalegrade,resultarea) {
	var tmp_article = sentence_splitter($("#"+article).val());
	var a_word_count = word_splitter($("#"+article).val()).length;
	var base_grade = $("#"+totalegrade).val() / a_word_count;
	var level = $("#"+level).val();

	var work_result = "";
	var words_html = "";
	var counter = 1;
	var grade = 0;
	var s_word_count = 0;
	tmp_article.forEach(function(e) {
		var sentence_number = counter > 20 ? (12880 + counter - 20) : (9311 + counter);
		work_result += String.fromCharCode(sentence_number) + e;
		s_word_count = word_splitter(e).length;
		s_grade = Math.floor(s_word_count * base_grade);
		grade += s_grade;
		words_html += '<div class="jumbotron">';
		words_html += '<div class="row">';
		words_html += '<div class="col-md-8">'
		words_html += "<h3>第" + counter +"句：</h3>";
		words_html += "<h4>" + e +"</h4>";
		words_html += "<h5>(" + s_grade + "分)</h5>\n";
		words_html += '</div>';
		words_html += '<div class="col-md-4">';
		words_html += lookupWord(e, level, lemma);
		words_html += '</div>';
		words_html += '</div>';
		words_html += '<div class="row">';
		words_html += '<div class="col-md-12 border">'
		words_html += '<h5>答：</h5>';
		words_html += '</div>';
		words_html += '</div>';
		words_html += '</div>';
		counter++;
	});
	work_result = '<div class="jumbotron"><h3>原文</h3>' + work_result + '</div>';
	work_result = work_result + words_html;
	work_result = '<div class="container-fluid"><h4>總分：' + grade + '分</h4>' + work_result+'</div>';
	$("#"+resultarea).html(work_result);
}

function downloadInnerHtml(filename, elId) {
 var contentDocument = document.getElementById(elId).innerHTML;
 var head = '<head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"></head>';
 var content = '<!DOCTYPE html>' + head + "<body>" + contentDocument + "</body>";
 var converted = htmlDocx.asBlob(content,{orientation: 'landscape'});
 saveAs(converted, filename);
 var link = document.createElement('a');
 link.href = URL.createObjectURL(converted);
 link.setAttribute('download', filename);
}


function printDiv(divId) {
	var printDivCSS = new String ('<link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" type="text/css">')
	window.frames["print_frame"].document.body.innerHTML=printDivCSS + document.getElementById(divId).innerHTML;
	window.frames["print_frame"].window.focus();
	window.frames["print_frame"].window.print();
}

function level_to_text(level){
	var newstring = "";
	if (level < 45){
		newstring = "博幼國小400單字第" + level + "課";
	}
	else if (level == 45){
		newstring = "博幼國小400單字全";
	}
	else if (45 < level && level  < 85){
		newstring = "博幼國中800單字第" + (level-45) + "課";
	}
	else if (level == 85){
		newstring = "博幼國小800單字全";
	}
	else if(level == 86){
		newstring = "國中2000單字";
	}
	return newstring;
}

function change_level_text(source,target){
	var level = $("#"+source).val();
	$("#"+target).text(level_to_text(level));
}
