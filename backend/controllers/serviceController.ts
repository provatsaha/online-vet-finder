import Service from "../models/Service";

export const getServiceById = async (req: any, res: any) => {
	try {
		const service = await Service.findById(req.params.id).populate("vet");
		res.status(200).json(service);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch service", error });
	}
};

export const getServicesById = async (req: any, res: any) => {
	try {
		const vet_id: any = req.body.vet_id;
		const services = await Service.find({ vet: vet_id }).populate("vet");
		res.status(200).json(services);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch services", error });
	}
};

export const newService = async (req: any, res: any) => {
	try {
		const service = await Service.create(req.body);
		const newService = await Service.findById(service._id).populate("vet");
		res.status(201).json(newService);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to create service", error });
	}
};

export const editService = async (req: any, res: any) => {
	try {
		const data: any = req.body;
		if (!data) {
			res.status(400).json({ message: "No data provided" });
			return;
		}
		const service = await Service.findByIdAndUpdate(data._id, data, {
			new: true,
		}).populate("vet");
		res.status(200).json(service);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to update service", error });
	}
};

export const deleteService = async (req: any, res: any) => {
	try {
		await Service.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Service deleted" });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to delete service", error });
	}
};

export const searchServices = async (req: any, res: any) => {
	try {
		const { searchText } = req.body;

		if (!searchText) {
			return res
				.status(400)
				.json({ message: "Search text is required." });
		}

		const services = await Service.find({
			$or: [
				{ name: { $regex: searchText, $options: "i" } },
				{ description: { $regex: searchText, $options: "i" } },
				{ "vet.name": { $regex: searchText, $options: "i" } },
				{ "vet.location": { $regex: searchText, $options: "i" } },
			],
		})
			.limit(20)
			.populate("vet");

		res.status(200).json(services);
	} catch (error: any) {
		res.status(500).json({
			message: "Failed to search services",
			error: error.message,
		});
	}
};
