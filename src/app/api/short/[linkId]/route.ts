import { NextResponse } from 'next/server';

import { db } from 'helpers/db';

type Media = {
  id: string;
  link: string;
};

type WidgetData = {
  type: string;
  id: string;
  data: {
    href?: string;
    medias?: Media[];
    [key: string]: unknown;
  };
};

type PictureWidgetType =
  | 'gallery'
  | 'logo-circle'
  | 'logo-square'
  | 'picture-16-9';

type PictureWidgetMapper = {
  // eslint-disable-next-line no-unused-vars
  [K in PictureWidgetType]: (
    data: WidgetData['data'],
    id: string
  ) => string | undefined;
};

type WidgetMapper = {
  // eslint-disable-next-line no-unused-vars
  button: (widget: WidgetData) => string | undefined;
  // eslint-disable-next-line no-unused-vars
  picture: (widget: WidgetData, id: string) => string | undefined;
};

const pictureWidgetMapper: PictureWidgetMapper = {
  gallery: (data, id) => data.medias?.find(media => media.id === id)?.link,
  'logo-circle': (data, id) =>
    data.medias?.find(media => media.id === id)?.link,
  'logo-square': (data, id) =>
    data.medias?.find(media => media.id === id)?.link,
  'picture-16-9': (data, id) =>
    data.medias?.find(media => media.id === id)?.link
};

const widgetMapper: WidgetMapper = {
  button: widget => widget.data.href,
  picture: (widget, id) => {
    const pictureType = widget.id as PictureWidgetType;
    return pictureWidgetMapper[pictureType]?.(widget.data, id);
  }
};

export async function GET(
  request: Request,
  { params: { linkId } }: { params: { linkId: string } }
) {
  try {
    const click = await db.click.create({
      include: { link: true },
      data: { linkId }
    });

    if (!click.link) {
      console.error('api::click::[linkId] Link not found', { linkId });
      return NextResponse.redirect('/');
    }

    const redirectUrl = click.link.url;

    console.log({ redirectUrl });

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('api::click::[linkId] Error processing click', {
      linkId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.redirect('/');
  }
}
