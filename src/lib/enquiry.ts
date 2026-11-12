export interface Enquiry {
  name: string;
  email: string;
  interest: string;
  message: string;
}

export function prepareEnquiry(values: Enquiry) {
  const subject = `ZAKI FX enquiry: ${values.interest}`;
  const body = `Hello Zaki,\n\n${values.message.trim()}\n\nI'm interested in: ${values.interest}\nName: ${values.name.trim()}\nReply email: ${values.email.trim()}\n\nThank you.`;
  return {
    body,
    mailto: `mailto:youvsyou@zakifx.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
