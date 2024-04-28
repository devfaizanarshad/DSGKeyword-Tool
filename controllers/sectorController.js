const express = require('express');
const Router = express.Router();
const Sectors = require('../models/Sectors');

Router.addSector = async (req, res) => {
    try {
        const { name, bussinessDisciplines } = req.body;

        if (name && bussinessDisciplines) {
            const findSectorExistence = await Sectors.find({ name: name });

            if (findSectorExistence.length > 0) {
                res.json({ status: 400, message: "This Sector Already Exists" });
            }
            else {
                let tagsBussinessDisciplines;
                if (Array.isArray(bussinessDisciplines)) {
                    tagsBussinessDisciplines = bussinessDisciplines;
                } else if (typeof bussinessDisciplines === 'string') {
                    tagsBussinessDisciplines = bussinessDisciplines.split(",");
                } else {
                    tagsBussinessDisciplines = [bussinessDisciplines];
                }
                
                const sectorData = new Sectors({
                    name: name,
                    bussinessDisciplines: tagsBussinessDisciplines
                });

                await sectorData.save();
                res.json({ status: 200, data: sectorData, message: "Sector Added Successfully" });
            }
        }
        else {
            res.json({ status: 400, message: "Please Input All Required Information" });
        }
    } catch (error) {
        console.log("error 3", error);
        res.json({ status: 500, error: 'An error occurred in uploading the image' });
    }
};

Router.listOfSectors = async (req, res) => {
    try {
        const sectorsData = await Sectors.find();
        res.json({ status: 200, data: sectorsData });
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.listOfSectorsName = async (req, res) => {
    try {
        const sectorsData = await Sectors.find();
        const sectorNames = sectorsData.map(sector => sector.name); // Extract names from sectorsData
        res.json({ status: 200, data: sectorNames }); // Send names array in response data
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};
Router.listOfBusinessDisciplines = async (req, res) => {
    try {
        let sectorName = req.params.name + " ";
        const sectorsData = await Sectors.find({ name: sectorName });
        // Check if sectorsData is not empty
        if (sectorsData.length > 0) {
            const bussinessDisciplinesNames = sectorsData[0].bussinessDisciplines;
            res.json({ status: 200, data: bussinessDisciplinesNames }); // Send names array in response data
        } else {
            res.json({ status: 404, error: 'Sector not found' });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.getSector = async (req, res) => {
    try {
        const checkSector = await Sectors.findById(req.params.id);
        if (checkSector) {
            res.json({ status: 200, message: "Sector get Successfully", data: checkSector });
        } else {
            res.json({ status: 400, message: "Sector not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.updateSector = async (req, res) => {
    try {
        const { name, bussinessDisciplines } = req.body;

        if (name && bussinessDisciplines) {
            const checkSector = await Sectors.findById(req.params.id);
            if (checkSector) {
                const updateObject = {
                    name: name,
                    bussinessDisciplines: bussinessDisciplines
                };

                await Sectors.findByIdAndUpdate({ _id: req.params.id }, { $set: updateObject })
                res.json({ status: 200, message: "Update Successfully" });
            } else {
                res.json({ status: 400, message: "Sector not found" });
            }
        } else {
            res.json({ status: 400, message: "Please Fill All Fields" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.deleteSector = async (req, res) => {
    try {
        const checkSector = await Sectors.findById(req.params.id);
        if (checkSector) {
            await Sectors.findByIdAndRemove(req.params.id);
            res.json({ status: 200, message: 'Sector deleted Successfully' });
        } else {
            res.json({ status: 400, message: 'Sector not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.json({ status: 500, error: 'An error occurred while retrieving the record.' });
    }
};

module.exports = Router;