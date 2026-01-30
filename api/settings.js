import dbConnect from './utils/db.js';
import Setting from './models/Setting.js';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const settings = await Setting.find({});
            const settingsMap = {};
            settings.forEach(s => {
                settingsMap[s.key] = s.value;
            });
            return res.status(200).json({ success: true, settings: settingsMap });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'POST' || req.method === 'PUT') {
        try {
            const { settings } = req.body;
            const promises = Object.keys(settings).map(key => {
                return Setting.findOneAndUpdate(
                    { key },
                    { key, value: settings[key] },
                    { upsert: true, new: true }
                );
            });
            await Promise.all(promises);
            return res.status(200).json({ success: true, message: 'Settings updated successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.status(405).json({ message: 'Method not allowed' });
}
