module.exports = {
    search: function() {
        
        const searchText = document.getElementById("commandListSearch").value || '';
        const matcher = new RegExp (searchText, "gi");
        
        for (let i=0; i<this.getListItem().length; i++) {
            if (this.matchTag(i, matcher) ||
                this.matchCommand(i, matcher) ||
                this.matchCommandDesc(i, matcher) ||
                this.matchCommandUsage(i, matcher)
            ) {
                this.getListItem()[i].style.display="flex";
            } else {
                this.getListItem()[i].style.display="none";
            }
        }
    },
    matchTag: function(index, matcher) {
        return matcher.test(document.getElementsByClassName("mdl-list__item-tag")[index].innerHTML);
    },
    matchCommand: function(index, matcher) {
        return matcher.test(document.getElementsByClassName("mdl-list__item-text")[index].innerHTML);
    },
    matchCommandDesc: function(index, matcher) {
        return matcher.test(document.getElementsByClassName("mdl-list__item-text-body")[index].innerHTML);
    },
    matchCommandUsage: function(index, matcher) {
        return matcher.test(document.getElementsByClassName("mdl-list__item-text-body-usage")[index].innerHTML);
    },
    getListItem: function () {
        return document.getElementsByClassName("mdl-list__item--three-line");
    }
}
