/**
 * @jest-environment jsdom
 */

import { PendingRequestType } from "@cryptkeeperzk/types";
import { act, render, screen } from "@testing-library/react";

import { createModalRoot, deleteModalRoot } from "@src/config/mock/modal";

import { RlnProofModal, RlnProofModalProps } from "..";
import { IUseRlnProofModalData, useRlnProofModal } from "../useRlnProofModal";

jest.mock("../useRlnProofModal", (): unknown => ({
  useRlnProofModal: jest.fn(),
}));

describe("ui/components/ConfirmRequestModal/components/ProofModal", () => {
  const defaultProps: RlnProofModalProps = {
    len: 1,
    loading: false,
    error: "",
    pendingRequest: {
      id: "1",
      type: PendingRequestType.SEMAPHORE_PROOF,
      payload: {
        rlnIdentifier: "rlnIdentifier",
        message: "externalNullifier",
        messageId: 1,
        messageLimit: 0,
        epoch: "1234",
        circuitFilePath: "circuitFilePath",
        verificationKey: "verificationKey",
        zkeyFilePath: "zkeyFilePath",
        urlOrigin: "http://localhost:3000",
      },
    },
    accept: jest.fn(),
    reject: jest.fn(),
  };

  const defaultHookData: IUseRlnProofModalData = {
    urlOrigin: defaultProps.pendingRequest.payload!.urlOrigin,
    faviconUrl: "",
    payload: defaultProps.pendingRequest.payload,
    onAccept: jest.fn(),
    onReject: jest.fn(),
    onOpenCircuitFile: jest.fn(),
    onOpenZkeyFile: jest.fn(),
    onOpenVerificationKeyFile: jest.fn(),
  };

  beforeEach(() => {
    (useRlnProofModal as jest.Mock).mockReturnValue(defaultHookData);

    createModalRoot();
  });

  afterEach(() => {
    deleteModalRoot();
  });

  test("should render properly", async () => {
    render(<RlnProofModal {...defaultProps} />);

    const modal = await screen.findByTestId("proof-modal");

    expect(modal).toBeInTheDocument();
  });

  test("should render properly with error", async () => {
    render(<RlnProofModal {...defaultProps} error="Error" len={2} />);

    const error = await screen.findByText("Error");

    expect(error).toBeInTheDocument();
  });

  test("should approve generation properly", async () => {
    render(<RlnProofModal {...defaultProps} />);

    const button = await screen.findByText("Approve");
    act(() => button.click());

    expect(defaultHookData.onAccept).toBeCalledTimes(1);
  });

  test("should reject proof generation properly", async () => {
    render(<RlnProofModal {...defaultProps} />);

    const button = await screen.findByText("Reject");
    act(() => button.click());

    expect(defaultHookData.onReject).toBeCalledTimes(1);
  });

  test("should open circuit file properly", async () => {
    render(<RlnProofModal {...defaultProps} />);

    const link = await screen.findByTestId("circuit-file-link");
    act(() => link.click());

    expect(defaultHookData.onOpenCircuitFile).toBeCalledTimes(1);
  });

  test("should open zkey file properly", async () => {
    render(<RlnProofModal {...defaultProps} />);

    const link = await screen.findByTestId("zkey-file-link");
    act(() => link.click());

    expect(defaultHookData.onOpenZkeyFile).toBeCalledTimes(1);
  });

  test("should open verification key file properly", async () => {
    render(<RlnProofModal {...defaultProps} />);

    const link = await screen.findByTestId("verification-key-file-link");
    act(() => link.click());

    expect(defaultHookData.onOpenVerificationKeyFile).toBeCalledTimes(1);
  });
});
