/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-extra-semi
;(function (global, factory) { typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = global || self, factory(global['WithServer'] = {})) }(this, (function WithServer(exports) {'use strict'
  /* validation */
  /**
   * 확장자 값을 파싱 처리
   * @param rawExt {string}
   */
  function getParsedExt(rawExt) {}
  /**
   * 확장자가 유효한 값인지 확인
   * @param ext {string}
   * @returns o {object}
   * @returns o.result {boolean}
   * @returns o.message {string | undefined}
   */
  async function isValidExt(ext) {}
  /**
   * 확장자가 유효한 값인지 확인(클라이언트에서 사용)
   * @param ext {string}
   * @param p {object}
   * @param p.maxCustomExtLength {number}
   * @param p.fixedExtList {string[]}
   * @param p.customExtList {string[]}
   * @returns o {object}
   * @returns o.result {boolean}
   * @returns o.message {string | undefined}
   */
  function isValidExtInClient(ext, { maxCustomExtLength, fixedExtList, customExtList }) {}

  /* dao */
  /**
   * 고정 확장자 리스트 데이터 저장
   * @param fixedExtList {string[]} 고정 확장자 목록
   */
  async function updateFixedExtList(fixedExtList) {}
  /**
   * 커스텀 확장자 리스트 데이터 저장
   * @param customExtList {string[]} 고정 확장자 목록
   */
  async function updateCustomExtList(customExtList) {}

  /* init */
  /**
   * 데이터를 초기화
   */
  function init() {}

  /* service */
  /**
   * 설정 정보를 조회
   */
  async function getConfig() {}
  /**
   * 선택 가능한 고정 확장자 전체 목록을 조회
   */
  async function getAllFixedExtList() {}
  /**
   * 고정 확장자 목록을 조회
   */
  async function getFixedExtList() {}
  /**
   * 커스텀 확장자 목록을 조회
   */
  async function getCustomExtList() {}
  /**
   * 고정 확장자 값을 목록에 추가
   * @param {string} ext 확장자 
   * @returns 확장자 값
   */
  async function insertFixedExt(ext) {}
  /**
   * 커스텀 확장자 값을 목록에 추가
   * @param {string} ext 확장자 
   * @returns 확장자 값
   */
  async function insertCustomExt(ext) {}
  /**
   * 고정 확장자 값을 목록에서 삭제
   * @param {string} ext 확장자 
   * @returns 확장자 값
   */
  async function removeFixedExt(ext) {
    const oldList = await getFixedExtList()
    const newList = oldList
      .filter(curExt => curExt !== ext)
      .filter((curExt, i, a) => a.indexOf(curExt) === i) /* uniq() */
      .sort()
    
    await updateFixedExtList(newList)
    return ext
  }
  /**
   * 커스텀 확장자 값을 목록에서 삭제
   * @param {string} ext 확장자 
   * @returns 확장자 값
   */
  async function removeCustomExt(ext) {
    const oldList = await getCustomExtList()
    const newList = oldList.concat(ext)
      .filter(curExt => curExt !== ext)
      .filter((curExt, i, a) => a.indexOf(curExt) === i) /* uniq() */
    
    await updateCustomExtList(newList)
    return ext
  }

  const WithServer = {
    getParsedExt,
    isValidExtInClient,
    init,
    getConfig,
    getAllFixedExtList,
    getFixedExtList,
    getCustomExtList,
    insertFixedExt,
    insertCustomExt,
    removeFixedExt,
    removeCustomExt,
  }
  /* module 형태로 export */
  Object.assign(exports, { ...WithServer })
})))
