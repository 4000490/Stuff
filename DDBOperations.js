/*	_FYI_

	Condition Expressions:
	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.SpecifyingConditions.html
	
	Work with a Secondary Index:
	http://docs.aws.amazon.com/amazondynamodb/latest/gettingstartedguide/GettingStarted.JsShell.06.html?shortFooter=true

	Modify Items in the Table:
	http://docs.aws.amazon.com/amazondynamodb/latest/gettingstartedguide/GettingStarted.JsShell.07.html?shortFooter=true

	DynamoDB Streams(interesante):
	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html?shortFooter=true#HowItWorks.CoreComponents.Streams

	Naming Rules and Data Types:
	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html
	
	Provisioned Throughput:
	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ProvisionedThroughput.html
	
	Guidelines for Working with Tables:
	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GuidelinesForTables.html

	Partitions and Data Distribution:
	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html

	Read Consistency:
	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html?shortFooter=true

	Reserved Words in DynamoDB:
	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html

	Best Practices for DynamoDB:
	http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/BestPractices.html
*/

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2'; /* Cada región es independiente de otras */

AWS.config.update({
    accessKeyId: "AKIAI2GZXTJHEM3VFKVA",
    secretAccessKey: "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",
    "region": "us-west-2" 
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();


/* Crear tabla */
myCreateTable();

/* Obtener descripción de una tabla */
//myDescribeTable();

/* Obtener lista de nombres de todas las tablas */
//myListTables();

/* Escribir un item a la tabla */
//myPut();

/* Escribir múltiples items en un solo paso */
//myBatchWrite();

/* Obtener un item */
//myGet();

/* Obtener múltiples items */
//myBatchGet();

/* Ejecutar un query y filtrar sus resultados */
//myQuery();

/* Eliminar un item */
//myDelte();

/* Eliminar una tabla */
//myDelteTable();



/************************************** Functions **************************************************/

function myCreateTable(){
	var params = {
	    TableName : "Music",
	    KeySchema: [       
	        { AttributeName: "Artist", KeyType: "HASH" },  //Partition key
	        { AttributeName: "SongTitle", KeyType: "RANGE" }  //Sort key
	    ],
	    AttributeDefinitions: [       
	        { AttributeName: "Artist", AttributeType: "S" },
	        { AttributeName: "SongTitle", AttributeType: "S" }
	    ],
	    ProvisionedThroughput: {       
	        ReadCapacityUnits: 1, 
	        WriteCapacityUnits: 1
	    }
	};
	/*	Dentro de ProvisionedThroughput se especifica el provisioned throughput capacity 
		para lecturas y escrituras, a una tabla que se quiere reservar en una partición de la db  
		(leer los detalles en Provisioned Throughput). */

	/*	El estado inicial de una tabla es: CREATING.
		Se puede iniciar a escribir y leer cuando el estado cambie a: ACTIVE. */

	/* 	Los items con la misma Partition key son alojados físicamente cerca, ordenaodos por su Sort key */

	/*	Para mejor throughput efficiency, la Partition key se recomienda que sea una que se vaya a utilizar
		uniformemente, es decir, que no sea una en la que uno de sus valores será considerablemente 
		más utilizada que las demás (evitar I/O "hot spots"). */

	dynamodb.createTable(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
}

function myDescribeTable(){
	var params = {
    	TableName: "Music"
	};

	dynamodb.describeTable(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
}

function myListTables(){
	var params = {};

	dynamodb.listTables(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
}

function myPut(){
/* En DynamoDB no es necesario haber declarado atributos inicialmente */
/* En DynamoDB es posible anidar atributos */ 
	var params = {
	    TableName: "Music",
	    Item: {
	        "Artist":"No One You Know",
	        "SongTitle":"Call Me Today",
	        "AlbumTitle":"Somewhat Famous",
	        "Year": 2015,
	        "Price": 2.14,
	        "Genre": "Country",
	        "Tags": {
	            "Composers": [
	                  "Smith",
	                  "Jones",
	                  "Davis"
	            ],
	            "LengthInSeconds": 214
	        }
	    },
	    "ConditionExpression": "attribute_not_exists(Artist) and attribute_not_exists(SongTitle)"
	};
	/*	Con "ConditionExpression" se previene sobreescribir un item ya existente con la misma llave primaria,
		ya que normalmente al escribir un item con una llave primaria ya existente se sobreescribe. */

	/*	Los atributos que contienen "{}" son Mapas.
		Los atributos que contienen "[]" son Listas. */

	docClient.put(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
}

function myBatchWrite(){
	var params = {
	    RequestItems: {
	        "Music": [ 
	            {  
	                PutRequest: {
	                    Item: {
	                        "Artist": "No One You Know",
	                        "SongTitle": "My Dog Spot",
	                        "AlbumTitle":"Hey Now",
	                        "Price": 1.98,
	                        "Genre": "Country",
	                        "CriticRating": 8.4
	                    }
	                }
	            }, 
	            { 
	                PutRequest: {
	                    Item: {
	                        "Artist": "No One You Know",
	                        "SongTitle": "Somewhere Down The Road",
	                        "AlbumTitle":"Somewhat Famous",
	                        "Genre": "Country",
	                        "CriticRating": 8.4,
	                        "Year": 1984
	                    }
	                }
	            }, 
	            { 
	                PutRequest: {
	                    Item: {
	                        "Artist": "The Acme Band",
	                        "SongTitle": "Still In Love",
	                        "AlbumTitle":"The Buck Starts Here",
	                        "Price": 2.47,
	                        "Genre": "Rock",
	                        "PromotionInfo": {
	                            "RadioStationsPlaying":[
	                                "KHCR", "KBQX", "WTNR", "WJJH"
	                            ],
	                            "TourDates": {
	                                "Seattle": "20150625",
	                                "Cleveland": "20150630"
	                            },
	                            "Rotation": "Heavy"
	                        }
	                    }
	                }
	            }, 
	            { 
	                PutRequest: {
	                    Item: {
	                        "Artist": "The Acme Band",
	                        "SongTitle": "Look Out, World",
	                        "AlbumTitle":"The Buck Starts Here",
	                        "Price": 0.99,
	                        "Genre": "Rock"
	                    }
	                }
	            }
	        ]
	    }
	};

	docClient.batchWrite(params, function (err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});

	/* ""UnprocessedItems": {}" indica que todos los items fueron escritos */ 
}

function myGet(){
	var params = { 
	    TableName: "Music",
	    Key: {
	        "Artist": "No One You Know",
	        "SongTitle": "Call Me Today"
	    },
	    ProjectionExpression: "AlbumTitle, #y, Tags.Composers[0], Tags.LengthInSeconds",
	    ExpressionAttributeNames: {"#y": "Year"}
	};
	/*	ProjectionExpression especifica los atributos que se quieren obtener del item */
	
	/*	"Year" es una palabra reservada de DynaboDB, por lo cual se utiliza un 
		placeholder token (#y) para definirlo en ExpressionAttributeNames y ser 
		reemplazado a la hora de ejecución */	
	
	/*	Los atributos anidados se obtenienen utilizando Document Path Notation.
		Para Listas se utilizan square brackets: [n], donde n es el número del elemento.
		Para Mapas se utiliza un punto: ".", que actua como separador entre elementos del mapa. */

	/*	Se puede utilizar el parametro ConsistentRead para operaciones de lectura (leer Read Consistency). */
	
	docClient.get(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
}

function myBatchGet(){
	var params = {
	    RequestItems: {
	        "Music": {
	            Keys: [
	                {
	                    "Artist": "No One You Know",
	                    "SongTitle": "My Dog Spot"
	                },
	                {
	                    "Artist": "No One You Know",
	                    "SongTitle": "Somewhere Down The Road"
	                },
	                {
	                    "Artist": "The Acme Band",
	                    "SongTitle": "Still In Love"
	                },
	                {
	                    "Artist": "The Acme Band",
	                    "SongTitle": "Look Out, World"
	                }
	            ],
	            ProjectionExpression:"PromotionInfo, CriticRating, Price"
	        }
	    }
	};
	/*	Si alguno de los items no contiene uno de los atributos especificados 
		en ProjectionExpression, aparecerá como un mapa vacio: {} en la respuesta */

	docClient.batchGet(params, function (err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
}

function myQuery(){
	var params = {
	    TableName: "Music",
	    ProjectionExpression: "SongTitle, PromotionInfo.Rotation",
	    KeyConditionExpression: "Artist = :artist",
	    FilterExpression: "size(PromotionInfo.RadioStationsPlaying) >= :howmany",
	    ExpressionAttributeValues: {
	        ":artist": "The Acme Band",
	        ":howmany": 3
	    },
	};
	/*	Dentro de KeyConditionExpression, :artist es un token, su valor se provee
		dentro de ExpressionAttributeValues. */

	/*	Los resultados de un query se pueden filtrar agregando el parametro FilterExpression. */

	docClient.query(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
}

function myDelte(){
	var params = {
	    TableName: "Music",
	    Key: {
	        Artist: "No One You Know", 
	        SongTitle: "My Dog Spot"
	    },
	    ConditionExpression: "Price = :price",
	    ExpressionAttributeValues: {
	        ":price": 0.00
	    }
	};
	/*	Por default, la operacion delete es incondicional. se puede
		utilizar ConditionExpression para condicionar los delete. */

	docClient.delete(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});	
}

function myDelteTable(){
	var params = {
	    TableName: "Music"
	};

	dynamodb.deleteTable(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
	/* Elemina la tabla, sus indices, y todos los datos permanentemente. */
}
