<template>
  <div>
    <div class="token-dropdown form-button-mobile">
      <div class="btn-group" aria-describedby="button-text">
        <button type="button" class="btn btn-outline-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          {{ selectedMethodName }}
        </button>

        <ul class="dropdown-menu">
          <li v-for="(method, mIdx) in methods" v-bind:key="method.name" class="flex flex-col gap-2">
            <span class="dropdown-item text-uppercase" @click="selectProposalMethod(mIdx)"> {{ mIdx }} - {{method.name}}</span>
          </li>
        </ul>


        <div v-for="(input, iIdx) in selectedMethedImputData" class="flex flex-col gap-2">
          <!--------- <textarea v-model="fundMetadata[key]" class="form-control deposit-input" placeholder="key"></textarea> -------->

          <li>
            <h3> {{ input.name }} ({{ input.internalType }}) </h3>
          </li>
          <li>
            <input v-model="input.data" class="form-control deposit-input">
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

/*

"inputs": [
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      },
      {
        "internalType": "uint16[]",
        "name": "_roles",
        "type": "uint16[]"
      },
      {
        "internalType": "bool[]",
        "name": "memberOf",
        "type": "bool[]"
      }
    ],

*/

export default {
  name: "ProposalEntry",
  props: ["methods"],

  data() {
    return {
      selectedMethodName: "-----------",
      selectedMethodInputs: [],
      selectedMethedImputData: [],
      inputIdx: 0,
      selectedMethodIdx: 0,
    }
  },

  components: { 
  },

  methods: {
    selectProposalMethod(methodIdx) {
      this.selectedMethodIdx = methodIdx;
      this.selectedMethodName = this.methods[methodIdx].name;
      this.selectedMethodInputs = this.methods[methodIdx].inputs;

      this.addSelectedMethedImputDataItem();
    },

    addSelectedMethedImputDataItem() {
      for (var iidx in this.methods[this.selectedMethodIdx].inputs) {
        let inputEntry = {
          idx: this.inputIdx++
        };
        //is array
        if (this.methods[this.selectedMethodIdx].inputs[iidx].name.endsWith("[]")) {
          inputEntry["data"] = [];
        } else {
          //is not array
          inputEntry["data"] = "";
        }

        inputEntry["internalType"] = this.methods[this.selectedMethodIdx].inputs[iidx].internalType;   
        inputEntry["name"] = this.methods[this.selectedMethodIdx].inputs[iidx].name;   

        this.selectedMethedImputData.push(inputEntry);
      }
    },  
  },
}
</script>

<style>

</style>