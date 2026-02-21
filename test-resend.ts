import { Resend } from 'resend';

const resend = new Resend('re_XrzpvCjc_HUyRrvtKpehSYkWmkygf7NkV');

async function testEmail() {
    try {
        const data = await resend.emails.send({
            from: 'randomguy109234@gmail.com',
            to: 'work.adityaswaroop@gmail.com',
            subject: 'Test Email Verification',
            html: '<p>Testing Resend integration.</p>'
        });
        console.log("Success:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

testEmail();
