import { MppPage } from './app.po';

describe('mpp App', () => {
  let page: MppPage;

  beforeEach(() => {
    page = new MppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
