# EnglishSentenceSplitter
一個英文閱讀的小工具，自動幫文章斷句，並製作分句的單字表

工具的功能很簡單，直接用HTML5 + Javascript完成
打開sentence_splitter_advanced.html後就可以使用
設定可以調整查詢單字的程度，系統只會查詢超出這個單字程度的單字
（EX: 使用者的單字程度是國中程度，則國中程度的單字系統不會查詢）

句子的標示方法有兩種，一種是把各句完全分開、一種是把句子標號後再於下方列出

單字字典來自https://github.com/skywind3000/ECDICT


工作結構很簡單:
高中程度字典檔： lemmatizer/js/senior_words.js
國中基礎程度字典檔： lemmatizer/js/words.js
英文字形變化解析用字典檔: lemmatizer/js/lemma.js lemmatizer/js/rare_lemmas.js
英漢字典檔: lemmatizer/js/dict_advanced.js

主要的語法都直接寫在sentence_splitter_advanced.html中了
