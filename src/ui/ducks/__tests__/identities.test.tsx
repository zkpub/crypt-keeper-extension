/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";

import { ZERO_ADDRESS } from "@src/config/const";
import { RPCAction } from "@src/constants";
import { store } from "@src/ui/store/configureAppStore";
import postMessage from "@src/util/postMessage";

import {
  createIdentityRequest,
  createIdentity,
  setActiveIdentity,
  setIdentityName,
  deleteIdentity,
  deleteAllIdentities,
  fetchIdentities,
  IdentitiesState,
  setIdentities,
  setIdentityRequestPending,
  setSelectedCommitment,
  useIdentities,
  useIdentityRequestPending,
  useSelectedIdentity,
} from "../identities";

describe("ui/ducks/identities", () => {
  const defaultIdentities: IdentitiesState["identities"] = [
    {
      commitment: "1",
      metadata: { account: ZERO_ADDRESS, name: "Account #1", identityStrategy: "interrep", web2Provider: "twitter" },
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch identities properly", async () => {
    (postMessage as jest.Mock)
      .mockResolvedValueOnce(defaultIdentities)
      .mockResolvedValueOnce(defaultIdentities[0].commitment);

    await Promise.resolve(store.dispatch(fetchIdentities()));
    const { identities } = store.getState();
    const identitiesHookData = renderHook(() => useIdentities(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    const selectedIdentityHookData = renderHook(() => useSelectedIdentity(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(identities.identities).toStrictEqual(defaultIdentities);
    expect(identitiesHookData.result.current).toStrictEqual(defaultIdentities);
    expect(selectedIdentityHookData.result.current).toStrictEqual(defaultIdentities[0]);
  });

  test("should set selected commitment properly", async () => {
    await Promise.resolve(store.dispatch(setSelectedCommitment("1")));
    const { identities } = store.getState();

    expect(identities.selected).toBe("1");
  });

  test("should set identities properly", async () => {
    await Promise.resolve(store.dispatch(setIdentities(defaultIdentities)));
    const { identities } = store.getState();

    expect(identities.identities).toStrictEqual(defaultIdentities);
  });

  test("should set identity request pending properly", async () => {
    await Promise.resolve(store.dispatch(setIdentityRequestPending(true)));
    const { identities } = store.getState();
    const { result } = renderHook(() => useIdentityRequestPending(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(identities.requestPending).toBe(true);
    expect(result.current).toBe(true);
  });

  test("should call create identity request action properly", async () => {
    await Promise.resolve(store.dispatch(createIdentityRequest()));

    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith({ method: RPCAction.CREATE_IDENTITY_REQ });
  });

  test("should call create identity request action properly", async () => {
    await Promise.resolve(store.dispatch(createIdentity("interrep", "signature", {})));

    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith({
      method: RPCAction.CREATE_IDENTITY,
      payload: { strategy: "interrep", messageSignature: "signature", options: {} },
    });
  });

  test("should call set active identity action properly", async () => {
    await Promise.resolve(store.dispatch(setActiveIdentity("1")));

    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith({
      method: RPCAction.SET_ACTIVE_IDENTITY,
      payload: {
        identityCommitment: "1",
      },
    });
  });

  test("should call set identity name action properly", async () => {
    await Promise.resolve(store.dispatch(setIdentityName("1", "name")));

    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith({
      method: RPCAction.SET_IDENTITY_NAME,
      payload: {
        identityCommitment: "1",
        name: "name",
      },
    });
  });

  test("should call delete identity action properly", async () => {
    await Promise.resolve(store.dispatch(deleteIdentity("1")));

    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith({
      method: RPCAction.DELETE_IDENTITY,
      payload: {
        identityCommitment: "1",
      },
    });
  });

  test("should call delete all identities action properly", async () => {
    await Promise.resolve(store.dispatch(deleteAllIdentities()));

    expect(postMessage).toBeCalledTimes(1);
    expect(postMessage).toBeCalledWith({
      method: RPCAction.DELETE_ALL_IDENTITIES,
    });
  });
});