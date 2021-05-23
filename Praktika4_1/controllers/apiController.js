var config = require('../config');
var pgp = require('pg-promise')();
var db = pgp(config.getDbConnectionString());
module.exports = function(app) {
	//Tegime tunnis
	//Näidata erinevid ruume, kus asuvad sensorid
	app.get('/api/rooms', function(req, res) {
		db
			.any('SELECT DISTINCT room FROM controller_sensor')
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch((err) => {
				res.json({
					description: 'Can’t find any room',
					error: err
				});
			});
	});

	//Näidata, erinevate ruumide sensoreid
	app.get('/api/room/:number/sensorid', function(req, res) {
		db
			.any(
				'SELECT sensor.sensorname FROM sensor INNER JOIN controller_sensor ON controller_sensor.id_sensor=sensor.id ' +
					'WHERE controller_sensor.room=' +
					req.params.number +
					':: varchar'
			)
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch(function(err) {
				return next(err);
			});
	});

	//Praktika5 Ülesanne1 jaoks oli tarvis muuta komponenti RoomSensors, et see kuvab mitte ainult andurite nimed, vaid ka anduri viimased näidud.
	app.get('/api/room/:number/sensors', function(req, res) {
		db
			.any(
				'SELECT sensor.sensorname, datasensor.data AS naidud FROM sensor' +
					' INNER JOIN controller_sensor ON controller_sensor.id_sensor=sensor.id' +
					' INNER JOIN datasensor ON datasensor.id_controllersensor=controller_sensor.id' +
					' WHERE controller_sensor.room=' +
					req.params.number +
					':: varchar'
			)
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch(function(err) {
				return next(err);
			});
	});

	//Ülesanne2
	//1) Näidata, millised kontrollerid on andmebaasis
	app.get('/api/controllers', function(req, res) {
		db
			.any('SELECT * FROM controller')
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch(function(err) {
				return next(err);
			});
	});

	//2) Näidata, millised andurid on konkreetse kontrolleriga ühendatud
	app.get('/api/controller/:number/sensors', function(req, res) {
		db
			.any(
				'SELECT sensor.sensorname FROM sensor INNER JOIN controller_sensor ON controller_sensor.id_sensor=sensor.id ' +
					'WHERE controller_sensor.id_controller=' +
					req.params.number
			)
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch(function(err) {
				return next(err);
			});
	});

	//3) Näidata auditooriumi nr 44 andurite andmeid täna
	app.get('/api/room44/datasensors', function(req, res) {
		db
			.any(
				'SELECT datasensor.data, datasensor.date_time, controller_sensor.id_sensor, sensor.sensorname, typevalue.valuetype, controller_sensor.state FROM datasensor' +
					' INNER JOIN controller_sensor ON controller_sensor.id=datasensor.id_controllersensor' +
					' INNER JOIN sensor ON sensor.id=controller_sensor.id_sensor' +
					' INNER JOIN typevalue ON typevalue.id=datasensor.id_typevalue' +
					" WHERE DATE(date_time) = CURRENT_DATE AND controller_sensor.room='44'"
			)
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch(function(err) {
				return next(err);
			});
	});

	//Tegin lisaks
	//Näidata andurite kõiki andmeid
	app.get('/api/room44/allsensordata', function(req, res, next) {
		db
			.any('SELECT * FROM datasensor')
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch(function(err) {
				return next(err);
			});
	});

	//Näidata auditooriumi nr 44 andurite andmeid
	app.get('/api/room44/data', function(req, res, next) {
		db
			.any(
				'SELECT datasensor.data FROM datasensor INNER JOIN controller_sensor ON controller_sensor.id=datasensor.id_controllersensor ' +
					'WHERE controller_sensor.room=' +
					44 +
					':: varchar'
			)
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch(function(err) {
				return next(err);
			});
	});
};
