class PeopleSortOption {
    constructor(display, property, reverse) {
        this.display = display;
        this.property = property;
        this.reverse = reverse;
    }
}

export class PeopleController {
    constructor(peopleService) {
        this.peopleService = peopleService;
        this.people = this.peopleService.getPeople();
        var defaultSortOption = new PeopleSortOption("alphabetical", "name", false);
        this.sortOptions = [defaultSortOption, new PeopleSortOption("oldest", "age", true)];
        this.sortBy = defaultSortOption;
    }
}