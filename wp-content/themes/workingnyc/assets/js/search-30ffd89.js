(function () {
    'use strict';

    /**
     * Search results
     *
     * @author NYC Opportunity
     */

    /**
     * Filter by jobs or programs
     */

    const baseButtonClass = 'btn-tag';
    const selectedButtonClass = 'btn-tag btn-primary';

    var allButton = document.getElementById("all-button");
    var jobsButton = document.getElementById("jobs-button");
    var programsButton = document.getElementById("programs-button");

    var searchResults = document.querySelectorAll('[data-js="search-result"]');

    // Buttons won't show up if there are no results
    if (allButton) {
        allButton.addEventListener("click", function () {
            allButton.className = selectedButtonClass;
            jobsButton.className = baseButtonClass;
            programsButton.className = baseButtonClass;
        
            for (var i = 0; i < searchResults.length; i++) {
                searchResults[i].style.display = "inherit";
            }
        });
    }

    if (jobsButton) {
        jobsButton.addEventListener("click", function () {
            allButton.className = baseButtonClass;
            jobsButton.className = selectedButtonClass;
            programsButton.className = baseButtonClass;
        
            for (var i = 0; i < searchResults.length; i++) {
                if (searchResults[i].getAttribute("data-js-result-type") == "job") {
                    searchResults[i].style.display = "inherit";
                }
                else {
                    searchResults[i].style.display = "none";
                }
            }
        });
    }

    if (programsButton) {
        programsButton.addEventListener("click", function () {
            allButton.className = baseButtonClass;
            jobsButton.className = baseButtonClass;
            programsButton.className = selectedButtonClass;
        
            for (var i = 0; i < searchResults.length; i++) {
                if (searchResults[i].getAttribute("data-js-result-type") == "program") {
                    searchResults[i].style.display = "inherit";
                }
                else {
                    searchResults[i].style.display = "none";
                }
            }
        });
    }

})();
