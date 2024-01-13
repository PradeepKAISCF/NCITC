// functions/index.js

import { firestore, auth } from "../context/firebase"; // Update the path accordingly
import { getFunctions, httpsCallable } from 'firebase/functions';
import nodemailer from 'nodemailer';

const functions = getFunctions();

export const checkFailedAttempts = functions.firestore
  .document('failedAttempts/{attemptId}')
  .onCreate(async (snapshot, context) => {
    const userId = snapshot.data().userId;
    console.log('Vanakam da mapla')

    // Get the count of failed attempts for the user
    const querySnapshot = await firestore
      .collection('failedAttempts')
      .where('userId', '==', userId)
      .get();

    const failedAttemptsCount = querySnapshot.size;

    // Set the threshold for sending an email
    const failedAttemptsThreshold = 3;

    if (failedAttemptsCount >= failedAttemptsThreshold) {
      // Send email notification to the user
      const userEmail = snapshot.data().userEmail;
      await sendEmailNotification(userEmail);
    }
  });

async function sendEmailNotification(userEmail) {
  // Configure nodemailer with your email service provider details
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pradeep123kaiscf@gmail.com',
      pass: 'Ap#9pllr2ppl',
    },
  });

  // Send email
  await transporter.sendMail({
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: 'Login Attempt Notification',
    text: 'There have been multiple failed login attempts on your account. Please review your account security.',
  });
}