import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { nanoid } from 'nanoid';
import {
  ScClient,
  ScAddr,
  ScConstruction,
  ScEventParams,
  ScEventType,
  ScTemplate,
  ScType,
  ScTemplateResult,
  ScLinkContent
} from 'ts-sc-client';
import { ScEdgeIdtf } from '../shared/sc-edge-idtf.enum';
import { ScnTreeNode, SemanticVicinity, SemanticVicinityByEdgeType } from '../model/scn-tree';

type ScTemplateParamValue = string | ScAddr | ScType;
type ScTemplateParam = [ScTemplateParamValue, string] | ScTemplateParamValue;

export const snakeToCamelCase = <Str extends string>(str: Str): Str => {
  return str.replace(/_(\w)/g, (_, p1) => p1.toUpperCase()) as Str;
};
@Injectable({
  providedIn: 'root',
})
export class ScClientService {
  private cache: Map<string, ScAddr> = new Map();

  private readonly scClient: ScClient;
  private readonly scTypeToScEdgeIdtfMap: Map<number, ScEdgeIdtf> = new Map<number, ScEdgeIdtf>([
    [ScType.EdgeAccessConstFuzPerm.value, ScEdgeIdtf.EdgeAccessConstFuzPerm],
    [ScType.EdgeAccessConstFuzTemp.value, ScEdgeIdtf.EdgeAccessConstFuzTemp],
    [ScType.EdgeAccessConstNegPerm.value, ScEdgeIdtf.EdgeAccessConstNegPerm],
    [ScType.EdgeAccessConstNegTemp.value, ScEdgeIdtf.EdgeAccessConstNegTemp],
    [ScType.EdgeAccessConstPosPerm.value, ScEdgeIdtf.EdgeAccessConstPosPerm],
    [ScType.EdgeAccessConstPosTemp.value, ScEdgeIdtf.EdgeAccessConstPosTemp],
    [ScType.EdgeAccessVarFuzPerm.value, ScEdgeIdtf.EdgeAccessVarFuzPerm],
    [ScType.EdgeAccessVarFuzTemp.value, ScEdgeIdtf.EdgeAccessVarFuzTemp],
    [ScType.EdgeAccessVarNegPerm.value, ScEdgeIdtf.EdgeAccessVarNegPerm],
    [ScType.EdgeAccessVarNegTemp.value, ScEdgeIdtf.EdgeAccessVarNegTemp],
    [ScType.EdgeAccessVarPosPerm.value, ScEdgeIdtf.EdgeAccessVarPosPerm],
    [ScType.EdgeAccessVarPosTemp.value, ScEdgeIdtf.EdgeAccessVarPosTemp],
    [ScType.EdgeDCommonConst.value, ScEdgeIdtf.EdgeDCommonConst],
    [ScType.EdgeDCommonVar.value, ScEdgeIdtf.EdgeDCommonVar],
    [ScType.EdgeUCommonConst.value, ScEdgeIdtf.EdgeUCommonConst],
    [ScType.EdgeUCommonVar.value, ScEdgeIdtf.EdgeUCommonVar]
  ]);

  constructor() {
    this.scClient = new ScClient(environment.webSocketAddress);
    // const t = new ScTemplate();
    // t.tripleWithRelation(ScType.Unknown, ScType.Unknown, ScType.Link, ScType.EdgeAccessVarPosPerm, new ScAddr(3));
    // this.templateSearch(t).then(async (sr) => {
    //     for (const r of sr) {
    //         console.log(await this.getLinkContents(r.get(2)), r.get(0).value);
    //     }
    // });
  }

  public findKeynodes = async <K extends [string, ...string[]]>(
    ...keynode: K
  ) => this.scClient.findKeynodes(...keynode);
  // stolen from ostis-ui-lib/utils because it's too cringe to import React as a peer dependency

  private async searchNodeByIdentifier(
    linkAddr: ScAddr,
    identification: ScAddr
  ) {
    const nodeAlias = '_node';

    const template = new ScTemplate();
    template.tripleWithRelation(
      [ScType.Unknown, nodeAlias],
      ScType.EdgeDCommonVar,
      linkAddr,
      ScType.EdgeAccessVarPosPerm,
      identification
    );
    const result = await this.scClient.templateSearch(template);
    if (result.length) {
      return result[0].get(nodeAlias);
    }

    return null;
  }
  // stolen from react-sc-web
  public async searchAddrById(str: string) {
    const [linkAddrs] = await this.scClient.getLinksByContents([str]);

    const { nrelMainIdtf, nrelSystemIdentifier } = await this.findKeynodes(
      'nrel_system_identifier',
      'nrel_main_idtf'
    );

    if (!linkAddrs.length) return null;

    const linkAddr = linkAddrs[0];
    const systemAddr = await this.searchNodeByIdentifier(
      linkAddr,
      nrelSystemIdentifier
    );

    if (systemAddr) return systemAddr;

    const mainAddr = await this.searchNodeByIdentifier(linkAddr, nrelMainIdtf);
    if (mainAddr) return mainAddr;

    return linkAddr;
  }

  public async templateGenerate(template: ScTemplate) {
    return this.scClient.templateGenerate(template);
  }

  public async templateSearch(template: ScTemplate) {
    return this.scClient.templateSearch(template);
  }

  public async getLinksByContents(contents: string[]) {
    return this.scClient.getLinksByContents(contents);
  }

  public async createElements(construction: ScConstruction) {
    return this.scClient.createElements(construction);
  }

  public async eventsCreate(params: ScEventParams) {
    return this.scClient.eventsCreate(params);
  }

  public async eventsDestroy(eventId: number | number[]) {
    return this.scClient.eventsDestroy(eventId);
  }

  public async newScnPage(makeCurrent: boolean = true, system_idtf?: string) {
    const action = new Action('action_new_scn_page', this);
    // has to be converted to string due to how agent interprets the makeCurrent argument
    // i'm seriously dissapointed in typescript due to the amount of type gymnastics required for this to work
    const args: [ScTemplateParam, ...ScTemplateParam[]] = system_idtf
      ? [makeCurrent as unknown as string, system_idtf]
      : [makeCurrent as unknown as string];

    await action.addArgs(...args);
    return action.initiate();
  }

  public async selectScnPage(idtf: string | ScAddr) {
    const action = new Action('action_select_scn_page', this);
    await action.addArgs(idtf);
    return action.initiate();
  }

  public async deleteScnPage(system_idtf: string) {
    const action = new Action('action_delete_scn_page', this);
    await action.addArgs(system_idtf);
    return action.initiate();
  }

  /**
   * Creates a new SCn page with the `idtf` as the root node, adds its semantic neighborhood
   * to the page and makes this page the current page.
   *
   * @param {string | ScAddr} idtf - The identifier of the SC element to use as the root node.
   * @return {Promise<void>} A promise that resolves when the SCn page is successfully opened.
   */
  public async openScnPage(idtf: string | ScAddr) {
    const action = new Action('action_open_scn_page', this);
    await action.addArgs(idtf);
    return action.initiate();
  }

  public async removeElementFromScnPage(idtf: ScAddr) {
    const action = new Action('action_remove_from_scn_page', this);
    await action.addArgs(idtf);
    return action.initiate();
  }

  public async addElementToScnPage(idtf: ScAddr) {
    const action = new Action('action_add_to_scn_page', this);
    await action.addArgs(idtf);
    return action.initiate();
  }

  public async getPageContents(idtf: ScAddr) {
    const template = new ScTemplate();
    template.triple(idtf, ScType.EdgeAccessVarPosPerm, ScType.Unknown);
    return (await this.scClient.templateSearch(template)).map((res) =>
      res.get(2)
    );
  }

  public async deleteScElement(scAddr: ScAddr): Promise<boolean> {
    return this.scClient.deleteElements([scAddr]);
  } 

  public async getNodeSystemIdtfByScAddr(addr: ScAddr, placeholder: string = '...'): Promise<string> {
    const systemIdtfTemplate: ScTemplate = new ScTemplate();
    systemIdtfTemplate.tripleWithRelation(
        addr,
        ScType.EdgeDCommon,
        ScType.Link,
        ScType.EdgeAccessVarPosPerm,
        new ScAddr(3)
    );

    const searchResult: ScTemplateResult = (await this.templateSearch(systemIdtfTemplate))[0];
    return searchResult ? await this.getLinkContents(searchResult.get(2)) : placeholder;
  }

  public async getNodeMainIdtfByScAddr(addr: ScAddr, placeholder: string = '...'): Promise<string> {
    const mainIdtfTemplate: ScTemplate = new ScTemplate();
    mainIdtfTemplate.tripleWithRelation(
        addr,
        ScType.EdgeDCommon,
        ScType.Link,
        ScType.EdgeAccessVarPosPerm,
        new ScAddr(743)
    );

    const searchResult: ScTemplateResult = (await this.templateSearch(mainIdtfTemplate))[0];
    return searchResult ? await this.getLinkContents(searchResult.get(2)) : placeholder;
  }

  public async getNodeSemanticVicinity(nodeAddr: ScAddr, depth: number = 1): Promise<SemanticVicinity> {
    const semanticVicinity: SemanticVicinity = new SemanticVicinity();
    if (depth === 0) {
        return semanticVicinity;
    }

    const tripleTemplate: ScTemplate = new ScTemplate();
    tripleTemplate.triple(nodeAddr, ScType.Unknown, ScType.Unknown);

    const reverseTripleTemplate: ScTemplate = new ScTemplate();
    reverseTripleTemplate.triple(ScType.Unknown, ScType.Unknown, nodeAddr);

    const [triples, reverseTriples] = await Promise.all([
        this.templateSearch(tripleTemplate),
        this.templateSearch(reverseTripleTemplate)
    ]);

    (await this.getEdgewiseSemanticVicinities(triples, true, depth)).forEach((vicinity: SemanticVicinityByEdgeType) => {
        semanticVicinity.add(vicinity.edgeType, vicinity);
    });
    (await this.getEdgewiseSemanticVicinities(reverseTriples, false, depth)).forEach((vicinity: SemanticVicinityByEdgeType) => {
        semanticVicinity.add(vicinity.edgeType, vicinity);
    });

    semanticVicinity.collapse();

    return semanticVicinity;
  }

  private async getEdgewiseSemanticVicinities(triples: ScTemplateResult[], rootIsSource: boolean, depth: number): Promise<SemanticVicinityByEdgeType[]> {
    const vicinities: SemanticVicinityByEdgeType[] = [];
    // vanilla cycle because using async/await
    for (const triple of triples) {
        const currNeighbor: ScAddr = triple.get(rootIsSource ? 2 : 0);
        const currNeighborIsLink: boolean = (await this.getScElementType(currNeighbor)).isLink();

        const currEdgeType: ScEdgeIdtf = await this.getScEdgeIdtf(triple.get(1));
        const currEdgeParentRelation: ScAddr | null = await this.getEdgeParentRelation(triple.get(1));
        
        const currNeighborTreeNode: ScnTreeNode = new ScnTreeNode({
            scAddr: currNeighbor,
            idtf: await this.getNodeMainIdtfByScAddr(currNeighbor),
            semanticVicinity: await this.getNodeSemanticVicinity(currNeighbor, depth - 1),
            isLink: currNeighborIsLink,
            htmlContents: currNeighborIsLink ? await this.getLinkContents(currNeighbor) : ''
        });

        vicinities.push(new SemanticVicinityByEdgeType({
            edgeType: currEdgeType,
            idtf: currEdgeParentRelation ? await this.getNodeMainIdtfByScAddr(currEdgeParentRelation, '') : '',
            relationScAddr: currEdgeParentRelation,
            sources: rootIsSource ? [] : [currNeighborTreeNode],
            targets: rootIsSource ? [currNeighborTreeNode] : []
        }));
    }

    return vicinities;
  }

  private async getScEdgeIdtf(edgeScAddr: ScAddr): Promise<ScEdgeIdtf> {
    return this.scTypeToScEdgeIdtfMap.get((await this.scClient.checkElements([edgeScAddr]))[0].value)!;
  }

  private async getLinkContents(scAddr: ScAddr): Promise<string> {
    return (await this.scClient.getLinkContents([scAddr]))[0].data as string;
  }

  private async getScElementType(scAddr: ScAddr): Promise<ScType> {
    return (await this.scClient.checkElements([scAddr]))[0];
  }

  private async getEdgeParentRelation(edgeScAddr: ScAddr): Promise<ScAddr | null> {
    const template: ScTemplate = new ScTemplate();
    template.triple(ScType.NodeVarNoRole, ScType.EdgeAccessVarPosPerm, edgeScAddr);
    template.triple(ScType.NodeVarRole, ScType.EdgeAccessVarPosPerm, edgeScAddr);
    return (await this.templateSearch(template))[0]?.get(0) ?? null;
  }
}

export class Action {
  public actionNodeAlias: string;

  private action: string;
  private template: ScTemplate;
  private actionNodeInited: Promise<void>;
  private onFirstTripleAdded: () => void;
  private scClientService: ScClientService;

  constructor(action: string, scClientService: ScClientService) {
    this.scClientService = scClientService;
    this.actionNodeAlias = nanoid(10);
    this.action = action;
    this.template = new ScTemplate();

    this.onFirstTripleAdded = () => undefined;
    this.actionNodeInited = new Promise(
      (resolve) => (this.onFirstTripleAdded = resolve)
    );

    this.addFirstTripple();
  }

  private addFirstTripple = async () => {
    const { question } = await this.scClientService.findKeynodes('question');
    this.onFirstTripleAdded();
    this.template.triple(question, ScType.EdgeAccessVarPosPerm, [
      ScType.NodeVar,
      this.actionNodeAlias,
    ]);
  };

  private initiateAction = async (actionNode: ScAddr) => {
    const { questionInitiated } = await this.scClientService.findKeynodes(
      'question_initiated'
    );

    const construction = new ScConstruction();
    construction.createEdge(
      ScType.EdgeAccessConstPosPerm,
      questionInitiated,
      actionNode
    );
    this.scClientService.createElements(construction);
  };

  private subscribeToAnswer = async (
    actionNode: ScAddr,
    onResponse: () => void
  ) => {
    const { questionFinished } = await this.scClientService.findKeynodes(
      'question_finished'
    );
    const onActionFinished = (
      _subscibedAddr: ScAddr,
      _arc: ScAddr,
      anotherAddr: ScAddr,
      eventId: number
    ) => {
      if (anotherAddr.isValid() && anotherAddr.equal(questionFinished)) {
        this.scClientService.eventsDestroy(eventId);
        onResponse();
      }
    };

    const eventParams = new ScEventParams(
      actionNode,
      ScEventType.AddIngoingEdge,
      onActionFinished
    );

    this.scClientService.eventsCreate(eventParams);
  };

  private findResultCircuit = async (actionNode: ScAddr) => {
    const { nrelAnswer } = await this.scClientService.findKeynodes(
      'nrel_answer'
    );

    const circuitAlias = '_circuit';
    const template = new ScTemplate();

    template.tripleWithRelation(
      actionNode,
      ScType.EdgeDCommonVar,
      [ScType.NodeVarStruct, circuitAlias],
      ScType.EdgeAccessVarPosPerm,
      nrelAnswer
    );
    const result = await this.scClientService.templateSearch(template);

    if (result.length) return result[0].get(circuitAlias);
    return null;
  };

  private generateAction = async () => {
    const generationResult = await this.scClientService.templateGenerate(
      this.template
    );

    if (generationResult && generationResult.size > 0) {
      return generationResult.get(this.actionNodeAlias);
    }
    return null;
  };

  public addToTemplate = async (
    cb: (template: ScTemplate) => void | Promise<void>
  ) => {
    await this.actionNodeInited;
    await cb(this.template);
  };

  public addArgs = async (...args: [ScTemplateParam, ...ScTemplateParam[]]) => {
    await this.actionNodeInited;
    const rrelBaseKeynodes = args.map((_, ind) => `rrel_${ind + 1}`) as [
      string,
      ...string[]
    ];
    const rrelKeynodes = await this.scClientService.findKeynodes(
      ...rrelBaseKeynodes
    );

    args.forEach((rrel, ind) => {
      this.template.tripleWithRelation(
        this.actionNodeAlias,
        ScType.EdgeAccessVarPosPerm,
        rrel,
        ScType.EdgeAccessVarPosPerm,
        rrelKeynodes[`rrel${ind + 1}`]
      );
    });
  };

  public initiate = () => {
    return new Promise<ScAddr | null>((resolve) => {
      this.scClientService.findKeynodes(this.action).then(async (keynodes) => {
        await this.actionNodeInited;

        this.template.triple(
          keynodes[snakeToCamelCase(this.action)],
          ScType.EdgeAccessVarPosPerm,
          this.actionNodeAlias
        );

        const actionNode = await this.generateAction();
        if (!actionNode) return resolve(null);

        const onResponse = async () => {
          resolve(await this.findResultCircuit(actionNode));
        };
        await this.subscribeToAnswer(actionNode, onResponse);
        await this.initiateAction(actionNode);
      });
    });
  };
}
