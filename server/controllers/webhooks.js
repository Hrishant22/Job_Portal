import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller function to manage clerk user with database
export const clerkWebhooks = async (req, res) => {
  try {
    console.log("✅ Webhook HIT");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body.toString());
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const evt = wh.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    const { data, type } = evt;
    console.log('Webhook event type:', type);

    switch (type) {
      case 'user.created':
        await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: ''
        });
        break;

      case 'user.updated':
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        });
        break;

      case 'user.deleted':
        await User.findByIdAndDelete(data.id);
        break;

      default:
        console.log("Unhandled webhook type:", type);
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).json({ success: false, message: 'Webhook error' });
  }
};
