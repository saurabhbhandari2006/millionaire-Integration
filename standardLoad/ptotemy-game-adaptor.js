var Class = function () {
    var parent,
        methods,
        klass = function () {
            this.initialize.apply(this, arguments);
            //copy the properties so that they can be called directly from the child
            //class without $super, i.e., this.name
            var reg = /\(([\s\S]*?)\)/;
            var params = reg.exec(this.initialize.toString());
            if (params) {
                var param_names = params[1].split(',');
                for (var i = 0; i < param_names.length; i++) {
                    this[param_names[i]] = arguments[i];
                }
            }
        },
        extend = function (destination, source) {
            for (var property in source) {
                destination[property] = source[property];
            }
            //IE 8 Bug: Native Object methods are only accessible directly
            //and do not come up in for loops. ("DontEnum Bug")
            if (!Object.getOwnPropertyNames) {
                var objMethods = [
                    'toString'
                    , 'valueOf'
                    , 'toLocaleString'
                    , 'isPrototypeOf'
                    , 'propertyIsEnumerable'
                    , 'hasOwnProperty'
                ];

                for (var i = 0; i < objMethods.length; i++) {
                    // if (  isNative(source,objMethods[i])
                    if (typeof source[objMethods[i]] === 'function'
                        && source[objMethods[i]].toString().indexOf('[native code]') == -1) {
                        document.writeln('copying ' + objMethods[i] + '<br>');
                        destination[objMethods[i]] = source[objMethods[i]];
                    }
                }
            }

            destination.$super = function (method) {
                return this.$parent[method].apply(this.$parent, Array.prototype.slice.call(arguments, 1));
            };
            return destination;
        };

    if (typeof arguments[0] === 'function') {
        parent = arguments[0];
        methods = arguments[1];
    } else {
        methods = arguments[0];
    }

    if (parent !== undefined) {
        extend(klass.prototype, parent.prototype);
        klass.prototype.$parent = parent.prototype;
    }
    extend(klass.prototype, methods);
    klass.prototype.constructor = klass;

    if (!klass.prototype.initialize) klass.prototype.initialize = function () {
    };

    return klass;
};

/* ----------------------------------------------------------- */
/* Helper Functions */
/* ----------------------------------------------------------- */

function loadConfig(obj) {
    var data = config[obj.name];
    switch (data.type) {
        case "environment":
            for (var j in data.states) {
                obj.defineState(data.states[j].name, data.states[j].representation);
            }
            for (var k in data.locations) {
                var thisLoc = obj.addLocation(data.locations[k].name, data.locations[k].sequence);
                for (var l in data.locations[k].states) {
                    thisLoc.defineState(data.locations[k].states[l].name, data.locations[k].states[l].representation);
                }
            }
            break;
        case "entity":
            for (var m in data.states) {
                obj.defineState(data.states[m].name, data.states[m].representation);
            }
            break;
        default:
            return false;
    }
    return true;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function toSnakeCase(str) {
    return str.split(" ").join("_").toLowerCase();
}

function randBetween(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function findByName(objClass, name) {
    result = $.grep(window[objClass].all, function (a) {
        return ( a.name == name);
    })[0];
    return (result == undefined) ? "Not Found" : result;
}
function findById(objClass, id) {
    result = $.grep(window[objClass].all, function (a) {
        return ( a.id == id);
    })[0];
    return (result == undefined) ? "Not Found" : result;
}

function shuffle(array) {
    for (var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
}

/* ----------------------------------------------------------- */
/* View State Helper */
/* ----------------------------------------------------------- */

var State = Class({
    initialize: function (name, representation) {
        this.name = name;
        this.representation = representation;
    }
});

function defineStateFn(obj, stateName, representation) {
    if (obj.states == undefined) obj.states = [];
    var $objElm = $('#' + obj.name);

    var thisState = $.grep(obj.states, function (a) {
        return ( a.name == stateName );
    })[0];

    if (obj.states.indexOf(thisState) != -1) obj.states.splice(obj.states.indexOf(thisState), 1);

    obj.states.push(new State(stateName, representation));
    $objElm.html(representation);
}

function setStateFn(obj, stateName) {
    var $objElm = $('#' + obj.name);
    var thisState = $.grep(obj.states, function (a) {
        return ( a.name == stateName );
    })[0];

    if (thisState != -1 && thisState != undefined) {
        $objElm.html(thisState.representation)
        return true;
    } else {
        return false
    }
}

function div(klass, kid) {
    return "<div class='" + klass + "' id='" + kid + "'></div>"
}

/* ----------------------------------------------------------- */
/* Logger Class */
/* ----------------------------------------------------------- */

var Logger = Class({
    initialize: function (name) {
        this.name = name;
        var privatelog = "";
        this.update = function (value) {
            privatelog = value;
        };
        this.contents = function () {
            return privatelog;
        }
    },
    add: function (msg) {
        this.update(this.contents() + msg + '<br/>');
        $(this).trigger('updated');
        return true;
    },
    reads: function () {
        return this.contents();
    }
});

var log = new Logger('Base');


/* ----------------------------------------------------------- */
/* Environment Classes */
/* ----------------------------------------------------------- */

var Location = Class({
    initialize: function (name, environment, sequence, entities, items, states) {
        this.name = name;
        this.environment = environment;
        this.sequence = sequence;
        this.entities = entities;
        this.items = items;
        this.states = states;
        log.add('Location ' + this.name + ' created in ' + this.environment.name);

        var currentState = "default";
        this.setMyState = function (stateName) {
            currentState = stateName;
        };
        this.getMyState = function () {
            return currentState;
        }
    },
    defineState: function (stateName, representation) {
        return defineStateFn(this, stateName, representation);
    },
    setState: function (stateName) {
        var newState = setStateFn(this, stateName);
        if (newState) this.setMyState(stateName);
        return newState;
    },
    getState: function () {
        return this.getMyState();
    },
    putEntity: function (entity) {
        if (this.entities == undefined) this.entities = [];
        this.entities.push(entity);
        return true;
    },
    removeEntity: function (entity) {
        if (this.entities.indexOf(entity) != -1) {
            this.entities.splice(this.entities.indexOf(entity), 1);
            return true
        }
        return false;
    },
    putItem: function (item) {
        if (this.items == undefined) this.items = [];
        this.items.push(item);
        return true;
    },
    removeItem: function (item) {
        if (this.items.indexOf(item) != -1) {
            this.items.splice(this.items.indexOf(item), 1);
            return true
        }
        return false;
    }
});

var Environment = Class({
    initialize: function (name, parent, locations, environments, states) {
        this.name = name;
        this.parent = parent;
        this.locations = locations;
        this.environments = environments;
        this.states = states;
        if (this.parent == undefined) {
            $('#ptotemy-game').append(div("environment", this.name));
        }
        log.add('Environment ' + name + ' created.');

        var currentState = "default";
        this.setMyState = function (stateName) {
            currentState = stateName;
        };
        this.getMyState = function () {
            return currentState;
        }

    },
    defineState: function (stateName, representation) {
        return defineStateFn(this, stateName, representation);
    },
    setState: function (stateName) {
        var newState = setStateFn(this, stateName);
        if (newState) this.setMyState(stateName);
        return newState;
    },
    getState: function () {
        return this.getMyState();
    },
    addLocation: function (locationName, sequence) {
        var thisLocation = toSnakeCase(locationName.toLowerCase());
        this[thisLocation] = new Location(locationName, this, (sequence == undefined ? "NA" : sequence), [], [], []);
        if (this.locations == undefined) this.locations = [];
        this.locations.push(this[thisLocation]);
        $("#" + this.name).append(div("location", this[thisLocation].name));
        return this[thisLocation];
    },
    addEnvironment: function (environmentName) {
        this[environmentName] = new Environment(environmentName, this, [], [], []);
        if (this.environments == undefined) this.environments = [];
        this.environments.push(this[environmentName]);
        $("#" + this.name).append(div("environment", this[environmentName].name));
        return this[environmentName];
    },
    prevLocation: function (location) {
        var currIndex = location.sequence;
        if (currIndex == 0 || currIndex == "NA") {
            return location;
        } else {
            return $.grep(this.locations, function (a) {
                return ( a.sequence == currIndex - 1 );
            })[0];
        }
    },
    nextLocation: function (location) {
        var currIndex = location.sequence;
        if (currIndex == this.locations.length || currIndex == "NA") {
            return location;
        } else {
            return $.grep(this.locations, function (a) {
                return ( a.sequence == currIndex + 1 );
            })[0];
        }
    }
});

/* ----------------------------------------------------------- */
/* Currency Class - Used with Entities */
/* ----------------------------------------------------------- */

var Currency = Class({
    initialize: function (name) {
        this.name = name;
        log.add('Currency ' + name + ' created')
    }
});

/* ----------------------------------------------------------- */
/* Attribute Class - Used with Items */
/* ----------------------------------------------------------- */

var Attribute = Class({
    initialize: function (name) {
        this.name = name;
        log.add('Attribute ' + name + ' created')
    }
});

/* ----------------------------------------------------------- */
/* Wallet Class */
/* ----------------------------------------------------------- */

var Wallet = Class({
    initialize: function (owner, contents, min, max) {
        this.owner = owner;
        this.contents = contents;
        this.min = min;
        this.max = max;
        log.add(this.owner.name.toLowerCase() + '.' + this.contents.name.toLowerCase() + ' created');

        var amount = 0;
        this.contains = function (value) {
            switch (true) {
                case (value > this.max):
                    $(this).trigger("max", [value, this.max]);
                    log.add(this.contents.name + ' update failed due to a Max out. Amount unchanged');
                    return false;
                case (value < this.min):
                    $(this).trigger("min", [value, this.min]);
                    log.add(this.contents.name + ' update failed due to a Min out. Amount unchanged');
                    return false;
                case (value == null):
                    return amount;
                default:
                    amount = value;
                    return amount;
            }
        }
    },
    is: function (value) {
        log.add('Updating ' + this.owner.name.toLowerCase() + "." + this.contents.name.toLowerCase() + ' to ' + value);
        return this.contains(value);
    },
    incrBy: function (value) {
        log.add('Increasing ' + this.owner.name.toLowerCase() + "." + this.contents.name.toLowerCase() + ' by ' + value);
        return this.contains(this.contains() + value);
    },
    decrBy: function (value) {
        log.add('Decreasing ' + this.owner.name.toLowerCase() + "." + this.contents.name.toLowerCase() + ' by ' + value);
        return this.contains(this.contains() - value);
    }
});

/* ----------------------------------------------------------- */
/* Entity Class */
/* ----------------------------------------------------------- */

var Entity = Class({
    initialize: function (name, items, states) {
        this.name = name;
        this.items = items;
        this.states = states;
        Entity.all.push(this);
        log.add('Entity ' + name + ' created');
        $("#entities").append(div("entity", this.name));

        var location = false;
        this.address = function (newLocation) {
            if (newLocation == null) {
                return location;
            } else {
                location = newLocation;
                console.log("************** CHANGE STARTS **************");
                $('#' + location.name).append(div("entity",  this.name));
                //$('#' + location.name).append($('#' + this.name));
                console.log("************** CHANGE ENDS **************");
                return true;
            }
        };

        var currentState = "default";
        this.setMyState = function (stateName) {
            currentState = stateName;
        };
        this.getMyState = function () {
            return currentState;
        }
    },
    defineState: function (stateName, representation) {
        return defineStateFn(this, stateName, representation);
    },
    setState: function (stateName) {
        var newState = setStateFn(this, stateName);
        if (newState) this.setMyState(stateName);
        return newState;
    },
    getState: function () {
        return this.getMyState();
    },
    createWallet: function (forCurrency, min, max, amount) {
        var wallet = forCurrency.name.toLowerCase();
        this[wallet] = new Wallet(this, forCurrency, min, max);
        this[wallet].is(amount);

        return true;
    },
    addItem: function (item) {
        return this.items.push(item);
    },
    pays: function (to, value, inCurrency) {
        var currency = inCurrency.name.toLowerCase();
        if (this[currency].decrBy(value) != false) {
            if (to[currency].incrBy(value) != false) {
                log.add(this.name + ' paid ' + value + ' ' + currency + ' to ' + to.name);
                return true;
            } else {
                this[currency].incrBy(value);
            }
        }
        return false;
    },
    gives: function (item, to) {
        if (to.items == undefined) to.items = [];
        return item.transfer(this, to)
    },
    buys: function (item, seller, payment, currency) {
        if (this.items == undefined) this.items = [];
        if (seller.gives(item, this) != false) {
            if (this.pays(seller, payment, currency) != false) {
                return true;
            } else {
                this.gives(item, seller)
            }
        }
        return false;
    },
    sells: function (item, buyer, payment, currency) {
        if (buyer.items == undefined) buyer.items = [];
        if (this.gives(item, buyer) != false) {
            if (buyer.pays(this, payment, currency) != false) {
                return true;
            } else {
                buyer.gives(item, this)
            }
        }
        return false;
    },
    trades: function (myItem, theirItem, partner) {
        if (this.items == undefined) this.items = [];
        if (partner.items == undefined) partner.items = [];
        if (this.gives(myItem, partner) != false) {
            if (partner.gives(theirItem, this) != false) {
                return true;
            } else {
                partner.gives(myItem, this)
            }
        }
        return false;
    },
    location: function (location) {
        if (location == undefined) {
            return this.address();
        } else {
            $(this).trigger("teleporting", [this.address(), location]);
            if (this.address() != false) {
                this.address().removeEntity(this);
            }
            location.putEntity(this);
            this.address(location);
            log.add(this.name + ' placed at ' + location.name);
            return true;
        }
    },
    moveTo: function (location) {
        $(this).trigger("moving", [this.address(), location]);
        this.address().removeEntity(this);
        location.putEntity(this);
        this.address(location);
        log.add(this.name + ' moved to ' + location.name);
        return true;
    },
    picks: function (item, location) {
        if (this.items == undefined) this.items = [];
        if (location.items.indexOf(item) != -1) {
            this.items.push(item);
            location.items.splice(location.items.indexOf(item), 1);
            return true;
        }
        return false;
    },
    drops: function (item, location) {
        if (location.items == undefined) location.items = [];
        if (this.items.indexOf(item) != -1) {
            location.items.push(item);
            this.items.splice(this.items.indexOf(item), 1);
            return true;
        }
        return false;
    },
    rollsDice: function (count) {
        var results = [];
        var localCount = 0;
        for (i in this.items) {
            if ('roll' in this.items[i]) {
                if (localCount < count) {
                    results.push(this.items[i].roll());
                    localCount++;
                }
            }
        }
        return results;
    }
});

Entity.all = [];

/* ----------------------------------------------------------- */
/* Item Class */
/* ----------------------------------------------------------- */

var Item = Class({
    initialize: function (name, states) {
        this.name = name;
        this.states = states;
        Item.all.push(this);
        log.add('Item ' + name + ' created.');
        $("#items").append(div("item", this.name));

        var currentState = "default";
        this.setMyState = function (stateName) {
            currentState = stateName;
        };
        this.getMyState = function () {
            return currentState;
        }
    },
    defineState: function (stateName, representation) {
        return defineStateFn(this, stateName, representation);
    },
    setState: function (stateName) {
        var newState = setStateFn(this, stateName);
        if (newState) this.setMyState(stateName);
        return newState;
    },
    getState: function () {
        return this.getMyState();
    },
    createAttribute: function (forAttribute, amount) {
        var wallet = forAttribute.name.toLowerCase();
        this[wallet] = new Wallet(this, forAttribute);
        this[wallet].is(amount);
        return true;
    },
    transfer: function (playerA, playerB) {
        if (playerA.items.indexOf(this) != -1) {
            playerA.items.splice(playerA.items.indexOf(this), 1);
            playerB.items.push(this);
            log.add(playerA.name + ' gave the ' + this.name + ' to ' + playerB.name);
            return true;
        }
        return false;
    }
});

Item.all = [];

/* ----------------------------------------------------------- */
/* Item Sub Classes */
/* ----------------------------------------------------------- */
/*-----------------------------------------------------------------------------------------------------------------------*/


/* ----------------------------------------------------------- */
/* Dice Class */
/* ----------------------------------------------------------- */

var Dice = Class(Item, {
    initialize: function (sides, name) {
        this.sides = sides;
        this.name = (name == null) ? "Dice#" + (Dice.all.length + 1) : name;
        this.$super('initialize', this.name);
        Dice.all.push(this);
    },
    roll: function (interval) {
        if (interval == null) {
            interval = 2000;
        }
        log.add(this.name + " dice started rolling for " + interval / 1000 + " secs");
        $(this).trigger('rollStart');
        var that = this;
        var result = randBetween(1, that.sides);
        setTimeout(function () {
            $(that).trigger('rollEnd', {result: result});
            log.add(that.name + " dice stopped. Final result was " + result);
        }, interval);
        return result;
    }
});

Dice.all = [];

/* ----------------------------------------------------------- */
/* Card Classes */
/* ----------------------------------------------------------- */

var Card = Class(Item, {
    initialize: function (name) {
        this.name = name;
        this.$super('initialize', this.name);
        Card.all.push(this);
    }
});

Card.all = [];

var CardDeck = Class(Entity, {
    initialize: function (name, cards) {
        this.$super('initialize', name, cards);
        this.name = name;
        this.cards = cards;
    },
    createCards: function (cardNames) {
        if (this.cards == undefined) this.cards = [];
        for (i in cardNames) {
            this.cards.push(new Card(cardNames[i]));
        }
        return true;
    },
    loadCards: function (cards) {
        if (this.cards == undefined) this.cards = [];
        for (i in cards) {
            this.$super('addItem', cards[i]);
        }
        return true;
    },
    shuffle: function () {
        var o = this.cards;
        for (var j, x, i = o.length - 1; i; j = ( Math.floor(Math.random() * i) + 1), x = o[--i], o[i] = o[j], o[j] = x);
        this.cards = o;
        return true;
    },
    swapDeck: function (deck) {
        var tempDeck = this.cards;
        this.cards = deck.cards;
        deck.cards = tempDeck;
        return true;
    },
    drawCard: function () {
        var takeOut = this.cards[0];
        this.cards.splice(0, 1);
        return takeOut;
    },
    cardToTop: function (card) {
        var newDeck = [];
        newDeck.push(card);
        newDeck.push(this.cards);
        this.cards = newDeck;
        return true;
    },
    cardToBottom: function (card) {
        this.cards.push(card);
        return true;
    }
});

