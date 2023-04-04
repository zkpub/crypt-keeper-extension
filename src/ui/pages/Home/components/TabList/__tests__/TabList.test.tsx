/**
 * @jest-environment jsdom
 */

import { act, render, screen } from "@testing-library/react";

import { ZERO_ADDRESS } from "@src/config/const";

import { TabList, TabListProps } from "..";

describe("ui/pages/Home/components/TabList", () => {
  const defaultProps: TabListProps = {
    children: [],
    identities: [
      {
        commitment: "0",
        metadata: {
          account: ZERO_ADDRESS,
          name: "Account #0",
          identityStrategy: "interrep",
          web2Provider: "twitter",
        },
      },
      {
        commitment: "1",
        metadata: {
          account: ZERO_ADDRESS,
          name: "Account #1",
          identityStrategy: "random",
        },
      },
    ],
    onDeleteAllIdentities: jest.fn(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should render properly", async () => {
    render(<TabList {...defaultProps} identities={[]} />);

    const component = await screen.findByTestId("tab-list");

    expect(component).toBeInTheDocument();
  });

  test("should accept to delete all identities properly", async () => {
    render(<TabList {...defaultProps} />);

    const icon = await screen.findByTestId("menu-icon");
    await act(async () => Promise.resolve(icon.click()));

    const deleteAllButton = await screen.findByText("Delete All");
    await act(async () => Promise.resolve(deleteAllButton.click()));

    const dangerModal = await screen.findByTestId("danger-modal");

    expect(dangerModal).toBeInTheDocument();

    const dangerModalAccept = await screen.findByTestId("danger-modal-accept");
    await act(async () => Promise.resolve(dangerModalAccept.click()));

    expect(defaultProps.onDeleteAllIdentities).toBeCalledTimes(1);
    expect(dangerModal).not.toBeInTheDocument();
  });

  test("should reject to delete all identities properly", async () => {
    render(<TabList {...defaultProps} />);

    const icon = await screen.findByTestId("menu-icon");
    await act(async () => Promise.resolve(icon.click()));

    const deleteAllButton = await screen.findByText("Delete All");
    await act(async () => Promise.resolve(deleteAllButton.click()));

    const dangerModal = await screen.findByTestId("danger-modal");

    expect(dangerModal).toBeInTheDocument();

    const dangerModalReject = await screen.findByTestId("danger-modal-reject");
    await act(async () => Promise.resolve(dangerModalReject.click()));

    expect(defaultProps.onDeleteAllIdentities).toBeCalledTimes(0);
    expect(dangerModal).not.toBeInTheDocument();
  });
});