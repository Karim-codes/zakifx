import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { programmes } from "@/data/programmes";
import App from "@/App";
import { ProgrammePage } from "@/components/programme-page";
import { prepareEnquiry } from "@/lib/enquiry";
import { createCandles } from "@/components/ui/candlestick-chart";
import { createMarketStudy } from "@/lib/market-study";

describe("programme and enrolment journeys", () => {
  for (const programme of programmes) {
    it(`keeps ${programme.id} on site and opens its matching form`, () => {
      render(<ProgrammePage programme={programme} />);
      fireEvent.click(
        screen.getByRole("button", { name: "Enrol in this programme" }),
      );
      const dialog = screen.getByRole("dialog");
      expect(dialog.hasAttribute("open")).toBe(true);
      expect(within(dialog).getByText(programme.interest)).toBeTruthy();
      expect(dialog.textContent).toContain(`£${programme.price}`);
      expect(
        within(dialog).getByLabelText("Your name").hasAttribute("required"),
      ).toBe(true);
      fireEvent.click(
        within(dialog).getByRole("button", { name: "Close enrolment form" }),
      );
      expect(dialog.hasAttribute("open")).toBe(false);
      expect(document.body.classList.contains("dialog-open")).toBe(false);
    });
  }
  it("prepares the correct enrolment email without sending or charging", () => {
    render(<ProgrammePage programme={programmes[2]} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Enrol in this programme" }),
    );
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Your name"), {
      target: { value: "Test & Learner" },
    });
    fireEvent.change(within(dialog).getByLabelText("Email address"), {
      target: { value: "learner@example.com" },
    });
    fireEvent.change(within(dialog).getByLabelText("Trading experience"), {
      target: { value: "Learning the fundamentals" },
    });
    fireEvent.change(
      within(dialog).getByLabelText("What would you like to work on?"),
      { target: { value: "Risk & process <script>test</script>" } },
    );
    const form = dialog.querySelector("form")!;
    expect(form.checkValidity()).toBe(true);
    fireEvent.submit(form);
    const link = within(dialog).getByRole("link", { name: "Open email draft" });
    const mail = new URL(link.getAttribute("href")!);
    expect(mail.protocol).toBe("mailto:");
    expect(mail.pathname).toBe("youvsyou@zakifx.com");
    expect(mail.searchParams.get("body")).toContain(
      "VIP 1-to-1 Mentorship (listed at £599 GBP)",
    );
    expect(mail.searchParams.get("body")).toContain("Test & Learner");
    expect(mail.searchParams.get("body")).toContain("<script>test</script>");
    expect(dialog.querySelector("script")).toBeNull();
    fireEvent.change(within(dialog).getByLabelText("Your name"), {
      target: { value: "Changed" },
    });
    expect(
      within(dialog).queryByRole("link", { name: "Open email draft" }),
    ).toBeNull();
  });
  it("rejects an incomplete form through native constraint validation", () => {
    render(<ProgrammePage programme={programmes[0]} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Enrol in this programme" }),
    );
    expect(
      screen.getByRole("dialog").querySelector("form")!.checkValidity(),
    ).toBe(false);
  });
});

describe("progressive content and motion", () => {
  it("renders all public programme routes and curricula without JavaScript", () => {
    for (const programme of programmes) {
      const html = renderToString(
        <App initialPath={`/programmes/${programme.slug}/`} />,
      );
      expect(html).toContain(programme.title);
      expect(html).toContain("curriculum-module");
      expect(html).toContain("Enrol in this programme");
      expect(html).not.toContain("https://www.zakifx.com/shop/p/");
    }
  });
  it("keeps public copy and course exploration in server markup", () => {
    const html = renderToString(<App />);
    expect(html).toContain("With Zaki.");
    expect(html).toContain("/assets/zaki-portrait.webp");
    expect(html.match(/<img[^>]+zaki-portrait/g)).toHaveLength(1);
    expect(html).toContain('<details class="programme"');
    expect(html).toContain("/programmes/vip-mentorship/");
    expect(html).toContain("chart-fallback");
    expect(html).not.toContain("motion-ready");
    expect(html).not.toContain("story-enhanced");
  });
  it("disables scroll reveals and pinning for reduced motion", () => {
    const previous = window.matchMedia;
    window.matchMedia = vi.fn((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const page = render(<App />);
    expect(document.documentElement.classList.contains("motion-ready")).toBe(
      false,
    );
    expect(page.container.querySelector(".story-enhanced")).toBeNull();
    window.matchMedia = previous;
  });
  it("keeps the chart sequence pinned when scrolling changes chapters", async () => {
    const page = render(<App />);
    const section = page.container.querySelector("#method") as HTMLElement;
    expect(section.classList.contains("story-enhanced")).toBe(true);
    Object.defineProperty(section, "offsetHeight", { value: 2400 });
    section.getBoundingClientRect = () => ({
      top: -1500,
      left: 0,
      right: 1000,
      bottom: 900,
      width: 1000,
      height: 2400,
      x: 0,
      y: -1500,
      toJSON() {},
    });
    fireEvent.scroll(window);
    await waitFor(() =>
      expect(section.classList.contains("chapter-2")).toBe(true),
    );
    expect(section.classList.contains("story-enhanced")).toBe(true);
  });
});

describe("safe illustrative data", () => {
  it("anchors a structure break to the first close above the earlier swing high", () => {
    const { data, level, breakIndex, swings } = createMarketStudy();
    expect(level).toBe(data[15].h);
    expect(data[breakIndex].c).toBeGreaterThan(level);
    data
      .slice(21, breakIndex)
      .forEach((c) => expect(c.c).toBeLessThanOrEqual(level));
    swings.forEach((point) =>
      expect(point.price).toBe(
        point.below ? data[point.index].l : data[point.index].h,
      ),
    );
    expect(swings[2].price).toBeGreaterThan(swings[0].price);
    expect(swings[3].price).toBeGreaterThan(swings[1].price);
  });
  it("uses a consistent 2:1 position drawing and valid OHLC data in either timeframe", () => {
    for (const hours of [1, 4]) {
      const { data, position, drawings } = createMarketStudy(hours);
      expect(
        (position.target - position.entry) / (position.entry - position.stop),
      ).toBe(2);
      expect(data[position.from].l).toBeLessThan(position.entry);
      expect(data[position.from].h).toBeGreaterThan(position.entry);
      expect(position.stop).toBeLessThan(data[34].l);
      expect(drawings[2]).toEqual([position]);
      data.forEach((c, i) => {
        expect(c.h).toBeGreaterThanOrEqual(Math.max(c.o, c.c));
        expect(c.l).toBeLessThanOrEqual(Math.min(c.o, c.c));
        if (i) expect(c.t - data[i - 1].t).toBe(hours * 3600000);
      });
    }
  });
  it("generates deterministic, internally consistent OHLC examples", () => {
    const data = createCandles(42, 120, { base: 2370, stepMs: 3600000 });
    expect(data).toEqual(
      createCandles(42, 120, { base: 2370, stepMs: 3600000 }),
    );
    data.forEach((c, i) => {
      expect(c.h).toBeGreaterThanOrEqual(Math.max(c.o, c.c));
      expect(c.l).toBeLessThanOrEqual(Math.min(c.o, c.c));
      if (i) expect(c.t - data[i - 1].t).toBe(3600000);
    });
  });
  it("encodes enquiry content into a draft URL", () => {
    const draft = prepareEnquiry({
      name: "A & B",
      email: "a@example.com",
      interest: "Course & mentorship",
      message: "What about risk?\nA second line.",
    });
    const url = new URL(draft.mailto);
    expect(url.searchParams.get("body")).toContain(
      "What about risk?\nA second line.",
    );
    expect(url.searchParams.get("subject")).toBe(
      "ZAKI FX enquiry: Course & mentorship",
    );
    const whatsapp = new URL(draft.whatsapp);
    expect(whatsapp.origin).toBe("https://wa.me");
    expect(whatsapp.pathname).toBe("/447522185202");
    expect(whatsapp.searchParams.get("text")).toBe(draft.body);
  });
});
