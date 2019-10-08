export interface Blog {
  _id?: string;
  title: string;
  desc: string;
  image_url: string;
  creator?: string;
  created_time?: Date;
}
